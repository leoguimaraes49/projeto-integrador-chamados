import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { readFileSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { TicketRepository } from './repositories/ticketRepository.js';
import { UserRepository } from './repositories/userRepository.js';
import { TicketEventPublisher } from './queues/ticketEventPublisher.js';
import { authRoutes } from './routes/authRoutes.js';
import { categoryRoutes } from './routes/categoryRoutes.js';
import { ticketRoutes } from './routes/ticketRoutes.js';
import { AuthService } from './services/authService.js';
import { TicketService } from './services/ticketService.js';

const openApiDocument = YAML.parse(
  readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8')
);

export function createApp(container = buildContainer()) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.get('/api-docs.json', (_req, res) => res.json(openApiDocument));
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'API do Sistema de Chamados'
    })
  );
  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: {
        error: {
          code: 'RATE_LIMITED',
          message: 'Muitas tentativas. Tente novamente em alguns minutos.'
        }
      }
    })
  );

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
    ticketService: new TicketService(
      ticketRepository,
      categoryRepository,
      new TicketEventPublisher()
    )
  };
}
