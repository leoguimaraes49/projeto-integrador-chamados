import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';

describe('API HTTP', () => {
  let container;
  let app;

  beforeEach(() => {
    container = {
      authService: {
        register: vi.fn(),
        login: vi.fn()
      },
      categoryRepository: {
        listActive: vi.fn()
      },
      ticketService: {
        listTickets: vi.fn(),
        createTicket: vi.fn(),
        getTicket: vi.fn(),
        assignTicket: vi.fn(),
        addMessage: vi.fn(),
        updateStatus: vi.fn()
      }
    };
    app = createApp(container);
  });

  it('exibe o health check', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'chamados-backend'
    });
  });

  it('publica o contrato OpenAPI', async () => {
    const response = await request(app).get('/api-docs.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths['/api/tickets']).toBeDefined();
  });

  it('encaminha o cadastro para o servico de autenticacao', async () => {
    const authResponse = {
      user: {
        id: 'user-1',
        name: 'Maria',
        email: 'maria@example.com',
        role: 'user'
      },
      token: 'token'
    };
    container.authService.register.mockResolvedValue(authResponse);

    const payload = {
      name: 'Maria',
      email: 'maria@example.com',
      password: '123456'
    };
    const response = await request(app).post('/api/auth/register').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(authResponse);
    expect(container.authService.register).toHaveBeenCalledWith(payload);
  });

  it('bloqueia chamados sem token', async () => {
    const response = await request(app).get('/api/tickets');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('TOKEN_REQUIRED');
    expect(container.ticketService.listTickets).not.toHaveBeenCalled();
  });

  it('repassa usuario e filtros autenticados ao servico', async () => {
    const user = {
      id: 'technician-1',
      name: 'Tecnico',
      email: 'tecnico@example.com',
      role: 'technician'
    };
    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '5m' });
    container.ticketService.listTickets.mockResolvedValue([]);

    const response = await request(app)
      .get('/api/tickets?status=open&priority=high')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ tickets: [] });
    expect(container.ticketService.listTickets).toHaveBeenCalledWith(
      expect.objectContaining(user),
      {
        status: 'open',
        priority: 'high'
      }
    );
  });
});
