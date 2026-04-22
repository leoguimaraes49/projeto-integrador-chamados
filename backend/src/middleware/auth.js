import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization ?? '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AppError('Token nao informado.', 401, 'TOKEN_REQUIRED'));
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return next(new AppError('Token invalido ou expirado.', 401, 'INVALID_TOKEN'));
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError('Acesso nao autorizado.', 403, 'FORBIDDEN'));
    }

    return next();
  };
}

