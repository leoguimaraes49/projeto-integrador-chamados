import dotenv from 'dotenv';

dotenv.config();

const defaultCorsOrigins = 'http://localhost:5173,http://127.0.0.1:5173';
const corsOrigins = (process.env.CORS_ORIGIN ?? defaultCorsOrigins)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgres://postgres:postgres@localhost:5432/chamados',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  corsOrigins
};
