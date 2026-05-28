import { describe, expect, it } from 'vitest';
import { AuthService } from '../src/services/authService.js';

describe('AuthService', () => {
  it('cadastra usuario com senha criptografada e retorna token', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);

    const result = await service.register({
      name: 'Ana',
      email: 'ANA@EXEMPLO.COM',
      password: '123456',
      role: 'user'
    });

    expect(result.user.email).toBe('ana@exemplo.com');
    expect(result.user.passwordHash).toBeUndefined();
    expect(result.token).toBeTruthy();
    expect(repository.users[0].passwordHash).not.toBe('123456');
  });

  it('impede cadastro com e-mail duplicado', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);

    await service.register({
      name: 'Matheus',
      email: 'matheus@exemplo.com',
      password: '123456'
    });

    await expect(
      service.register({
        name: 'Outro',
        email: 'MATHEUS@EXEMPLO.COM',
        password: '123456'
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('impede cadastro publico com perfil privilegiado', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);

    const result = await service.register({
      name: 'Tecnico indevido',
      email: 'tecnico@exemplo.com',
      password: '123456',
      role: 'technician'
    });

    expect(result.user.role).toBe('user');
    expect(repository.users[0].role).toBe('user');
  });

  it('recusa login com senha incorreta', async () => {
    const repository = new InMemoryUserRepository();
    const service = new AuthService(repository);

    await service.register({
      name: 'Cesar',
      email: 'cesar@exemplo.com',
      password: '123456'
    });

    await expect(
      service.login({
        email: 'cesar@exemplo.com',
        password: 'senha-errada'
      })
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

class InMemoryUserRepository {
  users = [];

  async create(user) {
    const saved = {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: new Date()
    };
    this.users.push(saved);
    return saved;
  }

  async findByEmail(email) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async markLastLogin(id) {
    const user = this.users.find((item) => item.id === id);
    if (user) {
      user.lastLoginAt = new Date();
    }
  }
}
