// Bookings service: price calculation, date-overlap check, ownership rules and SQL.
import { query } from '../config/db.js';
import { PICKUP_LOCATIONS } from '../config/pickupLocations.js';
import { badRequest, conflict, forbidden, notFound } from '../utils/AppError.js';
import { rentalDays, todayISO } from '../utils/dates.js';
import { getVehicle } from './vehicles.service.js';

export const INSURANCE_PER_DAY = 12;

// Booking row joined with the vehicle (and user) so the frontend gets everything in one request
const SELECT_BOOKING = `
  SELECT b.*, v.name AS vehicle_name, v.category AS vehicle_category, v.image_url AS vehicle_image,
         v.seats AS vehicle_seats, v.transmission AS vehicle_transmission, v.price_per_day AS vehicle_price_per_day,
         u.name AS user_name, u.email AS user_email
  FROM bookings b
  JOIN vehicles v ON v.id = b.vehicle_id
  JOIN users u ON u.id = b.user_id`;

// total = days * price per day (+ insurance per day)
export function calculatePrice(pricePerDay, startDate, endDate, insurance) {
  const days = rentalDays(startDate, endDate);
  let total = days * pricePerDay;
  if (insurance) {
    total += days * INSURANCE_PER_DAY;
  }
  return Math.round(total * 100) / 100;
}

function checkDates(startDate, endDate) {
  if (startDate < todayISO()) {
    throw badRequest('Start date cannot be in the past');
  }
  if (endDate <= startDate) {
    throw badRequest('End date must be after the start date');
  }
}

// Inventory rule: each location has one car of every model. So the same model can be booked
// at the same location only when the dates do not overlap. Cancelled bookings do not count,
// which is how a cancelled booking returns the car to the inventory.
async function checkOverlap(vehicleId, location, startDate, endDate, ignoreBookingId) {
  const result = await query(
    `SELECT id FROM bookings
     WHERE vehicle_id = $1 AND pickup_location = $2 AND status <> 'cancelled'
       AND start_date < $4 AND end_date > $3
       AND id <> $5`,
    [vehicleId, location, startDate, endDate, ignoreBookingId || 0]
  );
  if (result.rows.length > 0) {
    throw conflict('This model is already booked at ' + location + ' for the selected dates. Try another location or other dates.');
  }
}

function checkLocation(location) {
  if (!PICKUP_LOCATIONS.includes(location)) {
    throw badRequest('Unknown pickup location');
  }
}

// Loads a booking and makes sure the user is its owner (admins can access every booking)
async function getOwnedBooking(id, user) {
  const result = await query(SELECT_BOOKING + ' WHERE b.id = $1', [id]);
  const booking = result.rows[0];
  if (!booking) {
    throw notFound('Booking not found');
  }
  if (user.role !== 'admin' && booking.user_id !== user.id) {
    throw forbidden('This booking belongs to another user');
  }
  return booking;
}

export async function listByUser(userId) {
  const result = await query(SELECT_BOOKING + ' WHERE b.user_id = $1 ORDER BY b.start_date DESC', [userId]);
  return result.rows;
}

export async function listAll() {
  const result = await query(SELECT_BOOKING + ' ORDER BY b.created_at DESC');
  return result.rows;
}

export function getBooking(id, user) {
  return getOwnedBooking(id, user);
}

export async function createBooking(userId, data) {
  checkDates(data.start_date, data.end_date);
  const vehicle = await getVehicle(data.vehicle_id);
  if (!vehicle.available) {
    throw badRequest('This vehicle is currently not available');
  }
  checkLocation(data.pickup_location);
  await checkOverlap(vehicle.id, data.pickup_location, data.start_date, data.end_date);

  const total = calculatePrice(vehicle.price_per_day, data.start_date, data.end_date, data.insurance);
  const result = await query(
    `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, pickup_time, pickup_location, insurance, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [userId, vehicle.id, data.start_date, data.end_date, data.pickup_time || '10:00', data.pickup_location, data.insurance || false, total]
  );
  return getOwnedBooking(result.rows[0].id, { id: userId, role: 'user' });
}

export async function updateBooking(id, user, data) {
  const booking = await getOwnedBooking(id, user);
  if (booking.status !== 'pending') {
    throw badRequest('Only pending bookings can be changed');
  }
  checkDates(data.start_date, data.end_date);
  const vehicle = await getVehicle(data.vehicle_id);
  checkLocation(data.pickup_location);
  await checkOverlap(vehicle.id, data.pickup_location, data.start_date, data.end_date, id);

  const total = calculatePrice(vehicle.price_per_day, data.start_date, data.end_date, data.insurance);
  await query(
    `UPDATE bookings SET vehicle_id = $1, start_date = $2, end_date = $3, pickup_time = $4,
       pickup_location = $5, insurance = $6, total_price = $7
     WHERE id = $8`,
    [vehicle.id, data.start_date, data.end_date, data.pickup_time || '10:00', data.pickup_location, data.insurance || false, total, id]
  );
  return getOwnedBooking(id, user);
}

export async function cancelBooking(id, user) {
  const booking = await getOwnedBooking(id, user);
  if (booking.status === 'cancelled') {
    throw badRequest('Booking is already cancelled');
  }
  await query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [id]);
  return getOwnedBooking(id, user);
}

// Demo payment: no real card is charged, the booking simply becomes 'confirmed'
// Demo payment: no real charge happens. We check the card is not expired, keep only the
// last 4 digits (never the full number or CVC) and mark the booking as confirmed.
export async function payBooking(id, user, card) {
  const booking = await getOwnedBooking(id, user);
  if (booking.status !== 'pending') {
    throw badRequest('Only pending bookings can be paid');
  }
  const [month, year] = card.expiry.split('/').map(Number);
  const now = new Date();
  const expired = year + 2000 < now.getFullYear() || (year + 2000 === now.getFullYear() && month < now.getMonth() + 1);
  if (expired) {
    throw badRequest('The card has expired');
  }
  const last4 = card.card_number.slice(-4);
  await query("UPDATE bookings SET status = 'confirmed', card_last4 = $2 WHERE id = $1", [id, last4]);
  return getOwnedBooking(id, user);
}

export async function setStatus(id, status) {
  const result = await query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id', [status, id]);
  if (result.rows.length === 0) {
    throw notFound('Booking not found');
  }
  return getOwnedBooking(id, { role: 'admin' });
}

export async function deleteBooking(id) {
  const result = await query('DELETE FROM bookings WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    throw notFound('Booking not found');
  }
}
