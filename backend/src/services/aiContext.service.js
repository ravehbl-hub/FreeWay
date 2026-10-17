// AI context service: loads the user's data from the DB and formats it as text for the prompts.
// This is how the AI "works on the user's data".
import { query } from '../config/db.js';

// The user's last 10 bookings as short text lines
export async function getBookingsText(userId) {
  const result = await query(
    `SELECT b.id AS booking_id, b.start_date, b.end_date, b.status, b.total_price, b.pickup_location,
            v.id AS vehicle_id, v.name, v.category, v.seats, v.transmission
     FROM bookings b JOIN vehicles v ON v.id = b.vehicle_id
     WHERE b.user_id = $1
     ORDER BY b.start_date DESC
     LIMIT 10`,
    [userId]
  );
  if (result.rows.length === 0) {
    return 'No bookings yet (new customer).';
  }
  const lines = result.rows.map((b) => {
    return '- booking id ' + b.booking_id + ': ' + b.start_date + ' to ' + b.end_date + ': ' + b.name + ' (id ' + b.vehicle_id + ', ' + b.category +
      ', ' + b.seats + ' seats, ' + b.transmission + '), status ' + b.status +
      ', paid ' + b.total_price + ' EUR, pickup ' + b.pickup_location;
  });
  return lines.join('\n');
}

// All available vehicles as short text lines
export async function getVehiclesText() {
  const vehicles = await getAvailableVehicles();
  const lines = vehicles.map((v) => {
    return '- id ' + v.id + ': ' + v.name + ' | ' + v.category + ' | ' + v.seats + ' seats | ' + v.transmission +
      ' | ' + v.fuel_type + ' | ' + v.price_per_day + ' EUR/day | CO2 ' + v.co2_per_km + ' kg/km | ' + (v.description || '');
  });
  return lines.join('\n');
}

export async function getAvailableVehicles() {
  const result = await query('SELECT * FROM vehicles WHERE available = TRUE ORDER BY price_per_day');
  return result.rows;
}
