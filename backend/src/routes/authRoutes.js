import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

export function authRoutes(authService) {
  const router = Router();

  router.post('/register', async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/me', authenticate, (req, res) => {
    res.json({ user: req.user });
  });

  return router;
}

