// Fills the DB with demo data: 2 test users (admin + user), a vehicle catalog and sample bookings.
// Usage: npm run db:seed   (WARNING: clears existing data)
// Test users are listed in README.md
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { vehicles } from './vehicles.data.js';

const users = [
  { name: 'Admin FreeWay', email: 'admin@freeway.com', password: 'Admin123!', role: 'admin' },
  { name: 'Dana Cohen', email: 'user@freeway.com', password: 'User123!', role: 'user' },
];

function isoDaysFromNow(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'TRUNCATE ai_recommendations, ai_messages, ai_conversations, bookings, vehicles, users RESTART IDENTITY CASCADE'
    );

    const userIds = {};
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      const { rows } = await client.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [u.name, u.email, hash, u.role]
      );
      userIds[u.role] = rows[0].id;
    }

    const vehicleRows = [];
    for (const v of vehicles) {
      const { rows } = await client.query(
        `INSERT INTO vehicles (name, category, seats, transmission, fuel_type, price_per_day, image_url, co2_per_km, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, price_per_day`,
        v
      );
      vehicleRows.push(rows[0]);
    }

    // Sample bookings for the regular user (history for the AI to learn from)
    const sample = [
      { v: 4, start: -40, days: 3, status: 'confirmed', loc: 'Tel Aviv - Downtown' },
      { v: 5, start: -20, days: 4, status: 'confirmed', loc: 'Ben Gurion Airport' },
      { v: 1, start: -5, days: 2, status: 'cancelled', loc: 'Tel Aviv - Downtown' },
      { v: 5, start: 6, days: 2, status: 'pending', loc: 'Tel Aviv - Downtown' },
    ];
    for (const b of sample) {
      const vehicle = vehicleRows[b.v];
      await client.query(
        `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, pickup_location, status, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userIds.user, vehicle.id, isoDaysFromNow(b.start), isoDaysFromNow(b.start + b.days), b.loc, b.status, vehicle.price_per_day * b.days]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Run the seed and always close the pool. On failure Node prints the error and exits with code 1.
try {
  await seed();
} finally {
  await pool.end();
}
