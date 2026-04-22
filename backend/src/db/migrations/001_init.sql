CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_check CHECK (role IN ('user', 'technician', 'admin'))
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES users(id),
  technician_id UUID REFERENCES users(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tickets_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT tickets_status_check CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed', 'canceled'))
);

CREATE TABLE IF NOT EXISTS ticket_events (
  id UUID PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  message TEXT,
  previous_status TEXT,
  new_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_requester_id ON tickets(requester_id);
CREATE INDEX IF NOT EXISTS idx_tickets_technician_id ON tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_ticket_events_ticket_id ON ticket_events(ticket_id);

INSERT INTO categories (id, name)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Hardware'),
  ('22222222-2222-4222-8222-222222222222', 'Software'),
  ('33333333-3333-4333-8333-333333333333', 'Rede'),
  ('44444444-4444-4444-8444-444444444444', 'Acesso e contas')
ON CONFLICT (name) DO NOTHING;

