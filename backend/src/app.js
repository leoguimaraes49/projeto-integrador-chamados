import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { TicketRepository } from './repositories/ticketRepository.js';
import { UserRepository } from './repositories/userRepository.js';
import { authRoutes } from './routes/authRoutes.js';
import { categoryRoutes } from './routes/categoryRoutes.js';
import { ticketRoutes } from './routes/ticketRoutes.js';
import { AuthService } from './services/authService.js';
import { TicketService } from './services/ticketService.js';

export function createApp(container = buildContainer()) {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'chamados-backend'
    });
  });

  app.use('/api/auth', authRoutes(container.authService));
  app.use('/api/categories', categoryRoutes(container.categoryRepository));
  app.use('/api/tickets', ticketRoutes(container.ticketService));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

function buildContainer() {
  const userRepository = new UserRepository(pool);
  const categoryRepository = new CategoryRepository(pool);
  const ticketRepository = new TicketRepository(pool);

  return {
    authService: new AuthService(userRepository),
    categoryRepository,
    ticketService: new TicketService(ticketRepository, categoryRepository)
  };
}
