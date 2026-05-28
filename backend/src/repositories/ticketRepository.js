export class TicketRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(ticket) {
    const result = await this.pool.query(
      `
        INSERT INTO tickets (
          id, requester_id, category_id, title, description, priority, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        ticket.id,
        ticket.requesterId,
        ticket.categoryId,
        ticket.title,
        ticket.description,
        ticket.priority,
        ticket.status
      ]
    );

    return result.rows[0];
  }

  async list({ user, filters = {} }) {
    const conditions = [];
    const values = [];

    if (user.role === 'user') {
      values.push(user.id);
      conditions.push(`t.requester_id = $${values.length}`);
    }

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`t.status = $${values.length}`);
    }

    if (filters.priority) {
      values.push(filters.priority);
      conditions.push(`t.priority = $${values.length}`);
    }

    if (filters.categoryId) {
      values.push(filters.categoryId);
      conditions.push(`t.category_id = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await this.pool.query(
      `
        SELECT
          t.id,
          t.title,
          t.description,
          t.priority,
          t.status,
          t.due_at,
          t.closed_at,
          t.created_at,
          t.updated_at,
          c.id AS category_id,
          c.name AS category_name,
          requester.id AS requester_id,
          requester.name AS requester_name,
          technician.id AS technician_id,
          technician.name AS technician_name
        FROM tickets t
        JOIN categories c ON c.id = t.category_id
        JOIN users requester ON requester.id = t.requester_id
        LEFT JOIN users technician ON technician.id = t.technician_id
        ${where}
        ORDER BY t.created_at DESC
      `,
      values
    );

    return result.rows.map(mapTicketRow);
  }

  async findById(id) {
    const result = await this.pool.query(
      `
        SELECT
          t.id,
          t.title,
          t.description,
          t.priority,
          t.status,
          t.due_at,
          t.closed_at,
          t.created_at,
          t.updated_at,
          c.id AS category_id,
          c.name AS category_name,
          requester.id AS requester_id,
          requester.name AS requester_name,
          technician.id AS technician_id,
          technician.name AS technician_name
        FROM tickets t
        JOIN categories c ON c.id = t.category_id
        JOIN users requester ON requester.id = t.requester_id
        LEFT JOIN users technician ON technician.id = t.technician_id
        WHERE t.id = $1
      `,
      [id]
    );

    return result.rows[0] ? mapTicketRow(result.rows[0]) : null;
  }

  async assign(ticketId, technicianId) {
    const result = await this.pool.query(
      `
        UPDATE tickets
        SET technician_id = $2, status = 'in_progress', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [ticketId, technicianId]
    );

    return result.rows[0] ?? null;
  }

  async updateStatus(ticketId, status) {
    const result = await this.pool.query(
      `
        UPDATE tickets
        SET
          status = $2,
          closed_at = CASE
            WHEN $2 IN ('resolved', 'closed') THEN NOW()
            ELSE NULL
          END,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [ticketId, status]
    );

    return result.rows[0] ?? null;
  }

  async addEvent(event) {
    const result = await this.pool.query(
      `
        INSERT INTO ticket_events (
          id, ticket_id, author_id, type, message, previous_status, new_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, ticket_id, author_id, type, message, previous_status, new_status, created_at
      `,
      [
        event.id,
        event.ticketId,
        event.authorId,
        event.type,
        event.message ?? null,
        event.previousStatus ?? null,
        event.newStatus ?? null
      ]
    );

    return result.rows[0];
  }

  async listEvents(ticketId) {
    const result = await this.pool.query(
      `
        SELECT
          e.id,
          e.ticket_id,
          e.author_id,
          author.name AS author_name,
          e.type,
          e.message,
          e.previous_status,
          e.new_status,
          e.created_at
        FROM ticket_events e
        LEFT JOIN users author ON author.id = e.author_id
        WHERE e.ticket_id = $1
        ORDER BY e.created_at ASC
      `,
      [ticketId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      ticketId: row.ticket_id,
      author: row.author_id
        ? {
            id: row.author_id,
            name: row.author_name
          }
        : null,
      type: row.type,
      message: row.message,
      previousStatus: row.previous_status,
      newStatus: row.new_status,
      createdAt: row.created_at
    }));
  }
}

function mapTicketRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    dueAt: row.due_at,
    closedAt: row.closed_at,
    category: {
      id: row.category_id,
      name: row.category_name
    },
    requester: {
      id: row.requester_id,
      name: row.requester_name
    },
    technician: row.technician_id
      ? {
          id: row.technician_id,
          name: row.technician_name
        }
      : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
