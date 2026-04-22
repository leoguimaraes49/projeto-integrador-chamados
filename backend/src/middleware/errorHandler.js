import { AppError } from '../utils/appError.js';

export function notFound(_req, _res, next) {
  next(new AppError('Rota nao encontrada.', 404, 'ROUTE_NOT_FOUND'));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode ?? 500;
  const code = error.code ?? 'INTERNAL_ERROR';

  if (statusCode >= 500) {
    console.error(error);
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

