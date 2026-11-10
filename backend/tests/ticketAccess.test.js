import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { TicketService } from '../src/services/ticketService.js';

const owner = { id: 'owner-1', name: 'Solicitante', role: 'user' };
const otherUser = { id: 'user-2', name: 'Outro usuario', role: 'user' };
const technician = { id: 'tech-1', name: 'Tecnico', role: 'technician' };

function tokenFor(user, options = { expiresIn: '5m' }) {
  return jwt.sign(user, env.jwtSecret, options);
}

describe('Acesso HTTP aos chamados', () => {
  let app;
  let repository;
  let events;

  beforeEach(() => {
    events = [];
    const ticket = {
      id: 'ticket-1',
      title: 'Acesso ao sistema',
      status: 'open',
      requester: { id: owner.id, name: owner.name }
    };
    repository = {
      findById: vi.fn(async (id) => (id === ticket.id ? { ...ticket } : null)),
      listEvents: vi.fn(async () => events),
      addEvent: vi.fn(async (event) => {
        events.push(event);
        return event;
      }),
      assign: vi.fn(async (_id, technicianId) => {
        ticket.status = 'in_progress';
        return { ...ticket, technicianId };
      }),
      updateStatus: vi.fn(async (_id, status) => {
        ticket.status = status;
        return { ...ticket };
      })
    };
    const ticketService = new TicketService(repository, {});
    app = createApp({ authService: {}, categoryRepository: {}, ticketService });
  });

  it('rejeita token expirado antes de consultar o chamado', async () => {
    const expiredToken = tokenFor(owner, { expiresIn: -1 });
    const response = await request(app)
      .get('/api/tickets/ticket-1')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_TOKEN');
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('impede outro solicitante de ler ou comentar em um chamado', async () => {
    const authorization = `Bearer ${tokenFor(otherUser)}`;
    const read = await request(app)
      .get('/api/tickets/ticket-1')
      .set('Authorization', authorization);
    const comment = await request(app)
      .post('/api/tickets/ticket-1/messages')
      .set('Authorization', authorization)
      .send({ message: 'Tentativa de acesso' });

    expect(read.status).toBe(403);
    expect(comment.status).toBe(403);
    expect(repository.addEvent).not.toHaveBeenCalled();
    expect(events).toHaveLength(0);
  });

  it('impede solicitante de assumir ou alterar status', async () => {
    const authorization = `Bearer ${tokenFor(owner)}`;
    const assign = await request(app)
      .post('/api/tickets/ticket-1/assign')
      .set('Authorization', authorization);
    const changeStatus = await request(app)
      .patch('/api/tickets/ticket-1/status')
      .set('Authorization', authorization)
      .send({ status: 'resolved' });

    expect(assign.status).toBe(403);
    expect(changeStatus.status).toBe(403);
    expect(repository.assign).not.toHaveBeenCalled();
    expect(repository.updateStatus).not.toHaveBeenCalled();
  });

  it('permite que tecnico assuma chamado e registra o evento', async () => {
    const response = await request(app)
      .post('/api/tickets/ticket-1/assign')
      .set('Authorization', `Bearer ${tokenFor(technician)}`);

    expect(response.status).toBe(200);
    expect(response.body.ticket).toMatchObject({
      id: 'ticket-1',
      status: 'in_progress',
      technicianId: technician.id
    });
    expect(events).toEqual([
      expect.objectContaining({
        type: 'ticket_assigned',
        ticketId: 'ticket-1',
        authorId: technician.id,
        previousStatus: 'open',
        newStatus: 'in_progress'
      })
    ]);
  });
});
