import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/appError.js';

const PRIORITIES = new Set(['low', 'medium', 'high', 'critical']);
const STATUSES = new Set([
  'open',
  'in_progress',
  'waiting_user',
  'resolved',
  'closed',
  'canceled'
]);

export class TicketService {
  constructor(ticketRepository, categoryRepository) {
    this.ticketRepository = ticketRepository;
    this.categoryRepository = categoryRepository;
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

    return this.ticketRepository.addEvent({
      id: randomUUID(),
      ticketId,
      authorId: user.id,
      type: 'message_added',
      message: normalizedMessage
    });
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
      message: `Status alterado para ${status}.`,
      previousStatus: current.status,
      newStatus: status
    });

    return updated;
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
