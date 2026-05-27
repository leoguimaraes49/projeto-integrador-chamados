ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_due_at ON tickets(due_at);
CREATE INDEX IF NOT EXISTS idx_ticket_events_created_at ON ticket_events(ticket_id, created_at);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ticket_events_type_check'
  ) THEN
    ALTER TABLE ticket_events
    ADD CONSTRAINT ticket_events_type_check
    CHECK (type IN ('ticket_created', 'ticket_assigned', 'message_added', 'status_changed'));
  END IF;
END $$;
