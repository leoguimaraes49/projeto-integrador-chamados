import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

export function notFound(_req, _res, next) {
  next(new AppError('Rota nao encontrada.', 404, 'ROUTE_NOT_FOUND'));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode ?? 500;
  const code = error.code ?? 'INTERNAL_ERROR';

  if (statusCode >= 500) {
    logger.error('request_failed', {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack
    });
  }

  res.status(statusCode).json({
    error: {
      code,
      message:
        statusCode >= 500
          ? 'Erro interno do servidor.'
          : error.message
    }
  });
}
