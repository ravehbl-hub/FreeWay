// PostgreSQL connection pool (pg). Every SQL query in the app goes through query().
import pg from 'pg';
import { env } from './env.js';

// Return DATE columns as 'YYYY-MM-DD' strings and NUMERIC columns as numbers
pg.types.setTypeParser(1082, (value) => value);
pg.types.setTypeParser(1700, (value) => parseFloat(value));

let ssl = false;
if (env.dbSsl) {
  ssl = { rejectUnauthorized: false };
}

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: ssl,
  connectionTimeoutMillis: 5000,
});

// Without this listener an idle-connection error would crash the server
pool.on('error', () => {});

// Runs a parameterized query. $1, $2... placeholders protect against SQL injection.
export function query(text, params) {
  return pool.query(text, params);
}
