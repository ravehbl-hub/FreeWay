// Vehicles service: all SQL for the vehicle catalog.
import { query } from '../config/db.js';
import { badRequest, notFound } from '../utils/AppError.js';
import { PICKUP_LOCATIONS } from '../config/pickupLocations.js';
import { todayISO } from '../utils/dates.js';

// Columns an admin is allowed to set
const EDITABLE = ['name', 'category', 'seats', 'transmission', 'fuel_type', 'price_per_day', 'image_url', 'available', 'co2_per_km', 'description'];

// List vehicles with optional filters. Each filter adds a condition and a $n parameter.
export async function listVehicles(filters) {
  const conditions = [];
  const params = [];

  if (filters.category) {
    params.push(filters.category);
    conditions.push('category = $' + params.length);
  }
  if (filters.transmission) {
    params.push(filters.transmission);
    conditions.push('transmission = $' + params.length);
  }
  if (filters.maxPrice) {
    params.push(filters.maxPrice);
    conditions.push('price_per_day <= $' + params.length);
  }
  if (filters.minSeats) {
    params.push(filters.minSeats);
    conditions.push('seats >= $' + params.length);
  }
  if (filters.available !== undefined) {
    params.push(filters.available);
    conditions.push('available = $' + params.length);
  }
  if (filters.search) {
    params.push('%' + filters.search + '%');
    conditions.push('(name ILIKE $' + params.length + ' OR description ILIKE $' + params.length + ')');
  }

  // Inventory: one car of each model per location. When a location is given we also return
  // "booked" = true if that car is taken at that location for the dates (default: today).
  let bookedColumn = 'FALSE AS booked';
  if (filters.location) {
    const start = filters.start_date || todayISO();
    const end = filters.end_date || start;
    params.push(filters.location, start, end);
    const l = params.length;
    bookedColumn = `EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.vehicle_id = vehicles.id AND b.pickup_location = $${l - 2} AND b.status <> 'cancelled'
        AND b.start_date <= $${l} AND b.end_date >= $${l - 1}
    ) AS booked`;
  }

  let sql = 'SELECT vehicles.*, ' + bookedColumn + ' FROM vehicles';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY price_per_day ASC';

  const result = await query(sql, params);
  return result.rows;
}

// For one vehicle: which locations still have their car free for the given dates
export async function getAvailability(vehicleId, startDate, endDate) {
  await getVehicle(vehicleId);
  const result = await query(
    `SELECT DISTINCT pickup_location FROM bookings
     WHERE vehicle_id = $1 AND status <> 'cancelled'
       AND start_date < $3 AND end_date > $2`,
    [vehicleId, startDate, endDate]
  );
  const busy = result.rows.map((row) => row.pickup_location);
  return PICKUP_LOCATIONS.map((location) => ({ location: location, free: !busy.includes(location) }));
}

export async function getVehicle(id) {
  const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw notFound('Vehicle not found');
  }
  return result.rows[0];
}

export async function createVehicle(data) {
  const fields = EDITABLE.filter((field) => data[field] !== undefined);
  const values = fields.map((field) => data[field]);
  const placeholders = fields.map((field, index) => '$' + (index + 1));

  const sql = 'INSERT INTO vehicles (' + fields.join(', ') + ') VALUES (' + placeholders.join(', ') + ') RETURNING *';
  const result = await query(sql, values);
  return result.rows[0];
}

export async function updateVehicle(id, data) {
  const fields = EDITABLE.filter((field) => data[field] !== undefined);
  if (fields.length === 0) {
    throw badRequest('No fields to update');
  }
  const sets = fields.map((field, index) => field + ' = $' + (index + 1));
  const values = fields.map((field) => data[field]);
  values.push(id);

  const sql = 'UPDATE vehicles SET ' + sets.join(', ') + ' WHERE id = $' + values.length + ' RETURNING *';
  const result = await query(sql, values);
  if (result.rows.length === 0) {
    throw notFound('Vehicle not found');
  }
  return result.rows[0];
}

export async function deleteVehicle(id) {
  const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    throw notFound('Vehicle not found');
  }
}
