import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, 'migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function hasMigration(client, filename) {
  const result = await client.query(
    'SELECT 1 FROM schema_migrations WHERE filename = $1',
    [filename]
  );
  return result.rowCount > 0;
}

async function run() {
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);

    for (const file of files) {
      if (await hasMigration(client, file)) {
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migrations (filename) VALUES ($1)',
        [file]
      );
      await client.query('COMMIT');
      logger.info('migration_applied', { filename: file });
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

try {
  await run();
} catch (error) {
  logger.error('migration_failed', {
    errorMessage: error.message,
    stack: error.stack
  });
  process.exit(1);
}
