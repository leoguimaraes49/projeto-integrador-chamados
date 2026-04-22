import { describe, expect, it } from 'vitest';
import { TicketService } from '../src/services/ticketService.js';

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
    const { service } = buildService();

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
    const { service } = buildService();

    const ticket = await service.createTicket(requester, {
      title: 'Sem internet',
      description: 'A maquina nao conecta na rede.',
      categoryId: 'cat-network',
      priority: 'critical'
    });

    const assigned = await service.assignTicket(technician, ticket.id);

    expect(assigned.status).toBe('in_progress');
    expect(assigned.technician_id).toBe(technician.id);
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
});

function buildService() {
  const ticketRepository = new InMemoryTicketRepository();
  const categoryRepository = new InMemoryCategoryRepository();

  return {
    service: new TicketService(ticketRepository, categoryRepository),
    ticketRepository
  };
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
