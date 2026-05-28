import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

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

  console.log('Usuarios de demonstracao atualizados.');
  console.log('Usuario: usuario.demo@example.com / 123456');
  console.log('Tecnico: tecnico.demo@example.com / 123456');
}

run()
  .catch((error) => {
    console.error('Falha ao criar usuarios de demonstracao:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
