export class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(user) {
    const result = await this.pool.query(
      `
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, role, created_at
      `,
      [user.id, user.name, user.email, user.passwordHash, user.role]
    );

    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      `
        SELECT id, name, email, password_hash AS "passwordHash", role, created_at
        FROM users
        WHERE email = $1
      `,
      [email]
    );

    return result.rows[0] ?? null;
  }

  async findById(id) {
    const result = await this.pool.query(
      `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] ?? null;
  }
}

