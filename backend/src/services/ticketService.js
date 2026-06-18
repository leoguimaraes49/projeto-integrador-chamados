import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

const PRIORITIES = new Set(['low', 'medium', 'high', 'critical']);
const STATUS_LABELS = {
  open: 'Aberto',
  in_progress: 'Em atendimento',
  waiting_user: 'Aguardando usuario',
  resolved: 'Resolvido',
  closed: 'Fechado',
  canceled: 'Cancelado'
};
const STATUSES = new Set(Object.keys(STATUS_LABELS));

export class TicketService {
  constructor(ticketRepository, categoryRepository, ticketEventPublisher = null) {
    this.ticketRepository = ticketRepository;
    this.categoryRepository = categoryRepository;
    this.ticketEventPublisher = ticketEventPublisher;
  }

  async createTicket(user, input) {
    const title = String(input.title ?? '').trim();
    const description = String(input.description ?? '').trim();
    const categoryId = String(input.categoryId ?? '').trim();
    const priority = PRIORITIES.has(input.priority) ? input.priority : 'medium';

    if (!title) {
      throw new AppError('Titulo e obrigatorio.', 400, 'TITLE_REQUIRED');
    }

    if (!description) {
      throw new AppError('Descricao e obrigatoria.', 400, 'DESCRIPTION_REQUIRED');
    }

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError('Categoria invalida.', 400, 'INVALID_CATEGORY');
    }

    const ticket = await this.ticketRepository.create({
      id: randomUUID(),
      requesterId: user.id,
      categoryId,
      title,
      description,
      priority,
      status: 'open'
    });

    await this.ticketRepository.addEvent({
      id: randomUUID(),
      ticketId: ticket.id,
      authorId: user.id,
      type: 'ticket_created',
      message: 'Chamado criado.',
      newStatus: 'open'
    });

    await this.publishTicketEvent('ticket_created', {
      ticketId: ticket.id,
      requesterId: user.id,
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status
    });

    return this.getTicket(user, ticket.id);
  }

  async listTickets(user, filters = {}) {
    const normalizedFilters = {
      status: STATUSES.has(filters.status) ? filters.status : undefined,
      priority: PRIORITIES.has(filters.priority) ? filters.priority : undefined,
      categoryId: filters.categoryId
    };

    return this.ticketRepository.list({
      user,
      filters: normalizedFilters
    });
  }

  async getTicket(user, ticketId) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Chamado nao encontrado.', 404, 'TICKET_NOT_FOUND');
    }

    ensureCanReadTicket(user, ticket);

    const events = await this.ticketRepository.listEvents(ticket.id);
    return {
      ...ticket,
      events
    };
  }

  async assignTicket(user, ticketId) {
    ensureTechnician(user);

    const current = await this.ticketRepository.findById(ticketId);
    if (!current) {
      throw new AppError('Chamado nao encontrado.', 404, 'TICKET_NOT_FOUND');
    }

    const updated = await this.ticketRepository.assign(ticketId, user.id);
    await this.ticketRepository.addEvent({
      id: randomUUID(),
      ticketId,
      authorId: user.id,
      type: 'ticket_assigned',
      message: `Chamado assumido por ${user.name}.`,
      previousStatus: current.status,
      newStatus: 'in_progress'
    });

    await this.publishTicketEvent('ticket_assigned', {
      ticketId,
      technicianId: user.id,
      title: current.title,
      previousStatus: current.status,
      status: 'in_progress'
    });

    return updated;
  }

  async addMessage(user, ticketId, message) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Chamado nao encontrado.', 404, 'TICKET_NOT_FOUND');
    }

    ensureCanReadTicket(user, ticket);

    const normalizedMessage = String(message ?? '').trim();
    if (!normalizedMessage) {
      throw new AppError('Mensagem e obrigatoria.', 400, 'MESSAGE_REQUIRED');
    }

    const event = await this.ticketRepository.addEvent({
      id: randomUUID(),
      ticketId,
      authorId: user.id,
      type: 'message_added',
      message: normalizedMessage
    });

    await this.publishTicketEvent('message_added', {
      ticketId,
      authorId: user.id,
      title: ticket.title,
      message: normalizedMessage
    });

    if (user.role === 'user' && ticket.status === 'waiting_user') {
      await this.ticketRepository.updateStatus(ticketId, 'in_progress');
      await this.ticketRepository.addEvent({
        id: randomUUID(),
        ticketId,
        authorId: user.id,
        type: 'status_changed',
        message: 'Solicitante respondeu; chamado retornou ao atendimento.',
        previousStatus: 'waiting_user',
        newStatus: 'in_progress'
      });

      await this.publishTicketEvent('status_changed', {
        ticketId,
        authorId: user.id,
        title: ticket.title,
        previousStatus: 'waiting_user',
        status: 'in_progress'
      });
    }

    return event;
  }

  async updateStatus(user, ticketId, status) {
    ensureTechnician(user);

    if (!STATUSES.has(status)) {
      throw new AppError('Status invalido.', 400, 'INVALID_STATUS');
    }

    const current = await this.ticketRepository.findById(ticketId);
    if (!current) {
      throw new AppError('Chamado nao encontrado.', 404, 'TICKET_NOT_FOUND');
    }

    const updated = await this.ticketRepository.updateStatus(ticketId, status);
    await this.ticketRepository.addEvent({
      id: randomUUID(),
      ticketId,
      authorId: user.id,
      type: 'status_changed',
      message: `Status alterado para ${STATUS_LABELS[status]}.`,
      previousStatus: current.status,
      newStatus: status
    });

    await this.publishTicketEvent('status_changed', {
      ticketId,
      authorId: user.id,
      title: current.title,
      previousStatus: current.status,
      status
    });

    return updated;
  }

  async publishTicketEvent(type, payload) {
    if (!this.ticketEventPublisher) {
      return;
    }

    try {
      await this.ticketEventPublisher.publish(type, payload);
    } catch (error) {
      logger.error('ticket_event_publish_failed', {
        eventType: type,
        ticketId: payload.ticketId,
        errorMessage: error.message
      });
    }
  }
}

function ensureTechnician(user) {
  if (!['technician', 'admin'].includes(user.role)) {
    throw new AppError('Acesso restrito a tecnicos.', 403, 'FORBIDDEN');
  }
}

function ensureCanReadTicket(user, ticket) {
  if (user.role === 'user' && ticket.requester.id !== user.id) {
    throw new AppError('Voce nao tem acesso a este chamado.', 403, 'FORBIDDEN');
  }
}
