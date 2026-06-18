import { describe, expect, it, vi } from 'vitest';
import { TicketService } from '../src/services/ticketService.js';
import { logger } from '../src/utils/logger.js';

const requester = {
  id: 'user-1',
  name: 'Leonardo',
  email: 'leo@exemplo.com',
  role: 'user'
};

const otherRequester = {
  id: 'user-2',
  name: 'Ana',
  email: 'ana@exemplo.com',
  role: 'user'
};

const technician = {
  id: 'tech-1',
  name: 'Matheus',
  email: 'matheus@exemplo.com',
  role: 'technician'
};

describe('TicketService', () => {
  it('cria chamado aberto com evento inicial no historico', async () => {
    const { service, ticketEventPublisher } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Computador nao liga',
      description: 'O equipamento parou de ligar pela manha.',
      categoryId: 'cat-hardware',
      priority: 'high'
    });

    expect(ticket.status).toBe('open');
    expect(ticket.requester.id).toBe(requester.id);
    expect(ticket.events).toHaveLength(1);
    expect(ticket.events[0].type).toBe('ticket_created');
    expect(ticketEventPublisher.publishedEvents).toHaveLength(1);
    expect(ticketEventPublisher.publishedEvents[0]).toMatchObject({
      type: 'ticket_created',
      payload: {
        ticketId: ticket.id,
        requesterId: requester.id,
        status: 'open'
      }
    });
  });

  it('bloqueia usuario comum ao tentar ler chamado de outra pessoa', async () => {
    const { service } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Senha expirada',
      description: 'Preciso redefinir minha senha.',
      categoryId: 'cat-access',
      priority: 'medium'
    });

    await expect(service.getTicket(otherRequester, ticket.id)).rejects.toMatchObject({
      statusCode: 403
    });
  });

  it('permite que tecnico assuma chamado', async () => {
    const { service, ticketEventPublisher } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Sem internet',
      description: 'A maquina nao conecta na rede.',
      categoryId: 'cat-network',
      priority: 'critical'
    });

    const assigned = await service.assignTicket(technician, ticket.id);

    expect(assigned.status).toBe('in_progress');
    expect(assigned.technician_id).toBe(technician.id);
    expect(ticketEventPublisher.publishedEvents.at(-1)).toMatchObject({
      type: 'ticket_assigned',
      payload: {
        ticketId: ticket.id,
        technicianId: technician.id,
        status: 'in_progress'
      }
    });
  });

  it('publica evento quando mensagem e adicionada ao chamado', async () => {
    const { service, ticketEventPublisher } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Atualizar pacote',
      description: 'Solicito atualizacao do editor.',
      categoryId: 'cat-software',
      priority: 'low'
    });

    await service.addMessage(requester, ticket.id, 'Inclui mais detalhes.');

    expect(ticketEventPublisher.publishedEvents.at(-1)).toMatchObject({
      type: 'message_added',
      payload: {
        ticketId: ticket.id,
        authorId: requester.id,
        message: 'Inclui mais detalhes.'
      }
    });
  });

  it('retoma o atendimento quando o solicitante responde', async () => {
    const { service, ticketRepository, ticketEventPublisher } = buildService();
    const ticket = await service.createTicket(requester, {
      title: 'Confirmar acesso',
      description: 'O tecnico precisa de uma confirmacao.',
      categoryId: 'cat-access',
      priority: 'medium'
    });
    await service.updateStatus(technician, ticket.id, 'waiting_user');

    await service.addMessage(requester, ticket.id, 'O acesso voltou a funcionar.');

    const updated = await ticketRepository.findById(ticket.id);
    const events = await ticketRepository.listEvents(ticket.id);
    expect(updated.status).toBe('in_progress');
    expect(events.at(-1)).toMatchObject({
      type: 'status_changed',
      authorId: requester.id,
      previousStatus: 'waiting_user',
      newStatus: 'in_progress'
    });
    expect(ticketEventPublisher.publishedEvents.at(-1)).toMatchObject({
      type: 'status_changed',
      payload: {
        ticketId: ticket.id,
        authorId: requester.id,
        previousStatus: 'waiting_user',
        status: 'in_progress'
      }
    });
  });

  it('impede usuario comum de alterar status', async () => {
    const { service } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Sistema travando',
      description: 'O sistema fecha sozinho.',
      categoryId: 'cat-software',
      priority: 'medium'
    });

    await expect(
      service.updateStatus(requester, ticket.id, 'resolved')
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('publica evento quando tecnico altera status do chamado', async () => {
    const { service, ticketEventPublisher } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Fechar chamado',
      description: 'Chamado pronto para resolucao.',
      categoryId: 'cat-software',
      priority: 'medium'
    });

    const updated = await service.updateStatus(technician, ticket.id, 'resolved');

    expect(updated.status).toBe('resolved');
    expect(ticketEventPublisher.publishedEvents.at(-1)).toMatchObject({
      type: 'status_changed',
      payload: {
        ticketId: ticket.id,
        authorId: technician.id,
        previousStatus: 'open',
        status: 'resolved'
      }
    });
  });

  it('mantem a operacao quando a publicacao do evento falha', async () => {
    const ticketRepository = new InMemoryTicketRepository();
    const categoryRepository = new InMemoryCategoryRepository();
    const ticketEventPublisher = {
      publish: vi.fn().mockRejectedValue(new Error('RabbitMQ indisponivel'))
    };
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const service = new TicketService(
      ticketRepository,
      categoryRepository,
      ticketEventPublisher
    );

    const ticket = await service.createTicket(requester, {
      title: 'Falha temporaria de notificacao',
      description: 'O chamado deve ser salvo mesmo sem mensageria.',
      categoryId: 'cat-software',
      priority: 'medium'
    });

    expect(ticket.status).toBe('open');
    expect(logSpy).toHaveBeenCalledWith('ticket_event_publish_failed', {
      eventType: 'ticket_created',
      ticketId: ticket.id,
      errorMessage: 'RabbitMQ indisponivel'
    });

    logSpy.mockRestore();
  });
});

function buildService() {
  const ticketRepository = new InMemoryTicketRepository();
  const categoryRepository = new InMemoryCategoryRepository();
  const ticketEventPublisher = new InMemoryTicketEventPublisher();

  return {
    service: new TicketService(
      ticketRepository,
      categoryRepository,
      ticketEventPublisher
    ),
    ticketRepository,
    ticketEventPublisher
  };
}

class InMemoryTicketEventPublisher {
  publishedEvents = [];

  async publish(type, payload) {
    this.publishedEvents.push({ type, payload });
    return true;
  }
}

class InMemoryCategoryRepository {
  categories = new Map([
    ['cat-hardware', { id: 'cat-hardware', name: 'Hardware' }],
    ['cat-software', { id: 'cat-software', name: 'Software' }],
    ['cat-network', { id: 'cat-network', name: 'Rede' }],
    ['cat-access', { id: 'cat-access', name: 'Acesso e contas' }]
  ]);

  async findById(id) {
    return this.categories.get(id) ?? null;
  }
}

class InMemoryTicketRepository {
  tickets = new Map();
  events = new Map();

  async create(ticket) {
    const saved = {
      ...ticket,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.tickets.set(ticket.id, saved);
    return saved;
  }

  async list({ user }) {
    return [...this.tickets.values()]
      .map((ticket) => this.toPublicTicket(ticket))
      .filter((ticket) => user.role !== 'user' || ticket.requester.id === user.id);
  }

  async findById(id) {
    const ticket = this.tickets.get(id);
    return ticket ? this.toPublicTicket(ticket) : null;
  }

  async assign(ticketId, technicianId) {
    const ticket = this.tickets.get(ticketId);
    ticket.technicianId = technicianId;
    ticket.technician_id = technicianId;
    ticket.status = 'in_progress';
    return ticket;
  }

  async updateStatus(ticketId, status) {
    const ticket = this.tickets.get(ticketId);
    ticket.status = status;
    return ticket;
  }

  async addEvent(event) {
    const events = this.events.get(event.ticketId) ?? [];
    events.push(event);
    this.events.set(event.ticketId, events);
    return event;
  }

  async listEvents(ticketId) {
    return this.events.get(ticketId) ?? [];
  }

  toPublicTicket(ticket) {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      category: {
        id: ticket.categoryId,
        name: 'Categoria'
      },
      requester: {
        id: ticket.requesterId,
        name: ticket.requesterId === requester.id ? requester.name : otherRequester.name
      },
      technician: ticket.technicianId
        ? {
            id: ticket.technicianId,
            name: technician.name
          }
        : null,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    };
  }
}
