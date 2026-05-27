import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(input) {
    const name = String(input.name ?? '').trim();
    const email = normalizeEmail(input.email);
    const password = String(input.password ?? '');
    const role = 'user';

    if (!name) {
      throw new AppError('Nome e obrigatorio.', 400, 'NAME_REQUIRED');
    }

    validateEmail(email);
    validatePassword(password);

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('E-mail ja cadastrado.', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      id: randomUUID(),
      name,
      email,
      passwordHash,
      role
    });

    return buildAuthResponse(user);
  }

  async login(input) {
    const email = normalizeEmail(input.email);
    const password = String(input.password ?? '');

    validateEmail(email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciais invalidas.', 401, 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new AppError('Credenciais invalidas.', 401, 'INVALID_CREDENTIALS');
    }

    await this.userRepository.markLastLogin?.(user.id);

    return buildAuthResponse(toPublicUser(user));
  }
}

function buildAuthResponse(user) {
  const publicUser = toPublicUser(user);
  const token = jwt.sign(publicUser, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return {
    user: publicUser,
    token
  };
}

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError('E-mail invalido.', 400, 'INVALID_EMAIL');
  }
}

function validatePassword(password) {
  if (password.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres.', 400, 'WEAK_PASSWORD');
  }
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}
