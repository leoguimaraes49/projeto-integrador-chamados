import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

export function ticketRoutes(ticketService) {
  const router = Router();

  router.use(authenticate);

  router.get('/', async (req, res, next) => {
    try {
      const tickets = await ticketService.listTickets(req.user, req.query);
      res.json({ tickets });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const ticket = await ticketService.createTicket(req.user, req.body);
      res.status(201).json({ ticket });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const ticket = await ticketService.getTicket(req.user, req.params.id);
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/assign', async (req, res, next) => {
    try {
      const ticket = await ticketService.assignTicket(req.user, req.params.id);
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/messages', async (req, res, next) => {
    try {
      const event = await ticketService.addMessage(
        req.user,
        req.params.id,
        req.body.message
      );
      res.status(201).json({ event });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id/status', async (req, res, next) => {
    try {
      const ticket = await ticketService.updateStatus(
        req.user,
        req.params.id,
        req.body.status
      );
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

