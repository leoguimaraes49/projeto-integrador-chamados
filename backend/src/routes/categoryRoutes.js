import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

export function categoryRoutes(categoryRepository) {
  const router = Router();

  router.get('/', authenticate, async (_req, res, next) => {
    try {
      const categories = await categoryRepository.listActive();
      res.json({ categories });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

