export class CategoryRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async listActive() {
    const result = await this.pool.query(
      `
        SELECT id, name
        FROM categories
        WHERE active = TRUE
        ORDER BY name ASC
      `
    );

    return result.rows;
  }

  async findById(id) {
    const result = await this.pool.query(
      `
        SELECT id, name
        FROM categories
        WHERE id = $1 AND active = TRUE
      `,
      [id]
    );

    return result.rows[0] ?? null;
  }
}

