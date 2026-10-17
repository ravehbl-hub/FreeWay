// Creates all tables by running schema.sql against DATABASE_URL, then syncs the vehicle catalog.
// Usage: npm run db:migrate  (exit code 0 = success; on failure Node prints the error)
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { syncVehicles } from './syncVehicles.js';

const folder = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  if (!env.databaseUrl) {
    // List the names (never the values) of database-looking variables, to help debug hosting setups
    const names = Object.keys(process.env).filter((name) => /DATABASE|POSTGRES|PG/i.test(name));
    throw new Error(
      'DATABASE_URL is not set. On Railway add the variable DATABASE_URL=${{Postgres.DATABASE_URL}} to the backend service. ' +
      'Database-related variables found: ' + (names.length ? names.join(', ') : 'none')
    );
  }
  const sql = await fs.readFile(path.join(folder, 'schema.sql'), 'utf8');
  try {
    await pool.query(sql);
    await syncVehicles(pool);
  } finally {
    await pool.end();
  }
}

await migrate();
