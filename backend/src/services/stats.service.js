// Stats service: dashboard numbers calculated with SQL aggregate functions.
import { query } from '../config/db.js';

// Assumptions for the "CO2 saved" tile: average car emits 0.170 kg/km, a rental day is ~100 km
const AVERAGE_CAR_CO2_PER_KM = 0.17;
const KM_PER_DAY = 100;

export async function getUserStats(userId) {
  // Bookings created this calendar month (not cancelled)
  const monthResult = await query(
    `SELECT COUNT(*)::int AS count FROM bookings
     WHERE user_id = $1 AND status <> 'cancelled'
       AND date_trunc('month', start_date) = date_trunc('month', CURRENT_DATE)`,
    [userId]
  );

  // Percent of the fleet that is available
  const fleetResult = await query(
    `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE available)::int AS available FROM vehicles`
  );
  const fleet = fleetResult.rows[0];
  let availability = 0;
  if (fleet.total > 0) {
    availability = Math.round((fleet.available / fleet.total) * 100);
  }

  // CO2 saved this month compared to an average car
  const co2Result = await query(
    `SELECT COALESCE(SUM((b.end_date - b.start_date) * $2 * GREATEST($3 - v.co2_per_km, 0)), 0) AS saved
     FROM bookings b JOIN vehicles v ON v.id = b.vehicle_id
     WHERE b.user_id = $1 AND b.status <> 'cancelled'
       AND date_trunc('month', b.start_date) = date_trunc('month', CURRENT_DATE)`,
    [userId, KM_PER_DAY, AVERAGE_CAR_CO2_PER_KM]
  );

  return {
    bookingsThisMonth: monthResult.rows[0].count,
    availability: availability,
    co2Saved: Math.round(Number(co2Result.rows[0].saved) * 10) / 10,
  };
}

export async function getAdminStats() {
  const result = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM users) AS users,
       (SELECT COUNT(*)::int FROM vehicles) AS vehicles,
       (SELECT COUNT(*)::int FROM bookings) AS bookings,
       (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'confirmed') AS revenue`
  );
  return result.rows[0];
}
