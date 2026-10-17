// Keeps the vehicle catalog in the DB in sync with vehicles.data.js WITHOUT deleting anything.
// Runs on every deploy (from migrate.js): updates existing cars by name, inserts new ones.
// Users and bookings are never touched, so this is safe for a live site.
import { vehicles } from './vehicles.data.js';

export async function syncVehicles(db) {
  for (const v of vehicles) {
    const [name, category, seats, transmission, fuelType, price, imageUrl, co2, description] = v;
    const updated = await db.query(
      `UPDATE vehicles
       SET category = $2, seats = $3, transmission = $4, fuel_type = $5,
           price_per_day = $6, image_url = $7, co2_per_km = $8, description = $9
       WHERE name = $1`,
      [name, category, seats, transmission, fuelType, price, imageUrl, co2, description]
    );
    if (updated.rowCount === 0) {
      await db.query(
        `INSERT INTO vehicles (name, category, seats, transmission, fuel_type, price_per_day, image_url, co2_per_km, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [name, category, seats, transmission, fuelType, price, imageUrl, co2, description]
      );
    }
  }
}
