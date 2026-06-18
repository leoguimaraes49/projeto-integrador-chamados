import bcrypt from 'bcryptjs';
import { pool } from './pool.js';
import { logger } from '../utils/logger.js';

const demoUsers = [
  {
    id: '55555555-5555-4555-8555-555555555555',
    name: 'Usuario Demo',
    email: 'usuario.demo@example.com',
    role: 'user'
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    name: 'Tecnico Demo',
    email: 'tecnico.demo@example.com',
    role: 'technician'
  }
];

async function run() {
  const passwordHash = await bcrypt.hash('123456', 10);

  for (const user of demoUsers) {
    await pool.query(
      `
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email)
        DO UPDATE SET
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role
      `,
      [user.id, user.name, user.email, passwordHash, user.role]
    );
  }

  logger.info('demo_users_seeded', { count: demoUsers.length });
}

try {
  await run();
} catch (error) {
  logger.error('demo_users_seed_failed', {
    errorMessage: error.message,
    stack: error.stack
  });
  process.exitCode = 1;
} finally {
  await pool.end();
}
