// AI recommendations service: Gemini reads the user's booking history and returns
// structured JSON (vehicle ids + reasons). We validate it and save it in the DB.
import { query } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { todayISO } from '../utils/dates.js';
import { RECOMMENDATION_SCHEMA, RECOMMENDATION_SYSTEM_PROMPT, fillTemplate } from '../ai/prompts.js';
import { getAvailableVehicles, getBookingsText, getVehiclesText } from './aiContext.service.js';
import { generateJson } from './gemini.service.js';

// Latest saved recommendations of the user, joined with the vehicle details
export async function getSaved(userId) {
  const result = await query(
    `SELECT r.id, r.vehicle_id, r.reason, r.score, r.summary, r.created_at,
            v.name, v.category, v.seats, v.transmission, v.price_per_day, v.image_url, v.fuel_type
     FROM ai_recommendations r JOIN vehicles v ON v.id = r.vehicle_id
     WHERE r.user_id = $1
     ORDER BY r.score DESC`,
    [userId]
  );
  return result.rows;
}

export async function generate(userId) {
  const bookingsText = await getBookingsText(userId);
  const vehiclesText = await getVehiclesText();
  const prompt = fillTemplate(RECOMMENDATION_SYSTEM_PROMPT, {
    TODAY: todayISO(),
    BOOKINGS: bookingsText,
    VEHICLES: vehiclesText,
  });

  const data = await generateJson(prompt, 'Recommend 3 vehicles for my next rental.', RECOMMENDATION_SCHEMA);

  // Never trust the AI blindly: keep only ids that really exist and are available
  const vehicles = await getAvailableVehicles();
  const validIds = vehicles.map((v) => v.id);
  const items = (data.recommendations || [])
    .filter((item) => validIds.includes(item.vehicleId))
    .slice(0, 3);

  if (items.length === 0) {
    throw new AppError(502, 'The AI did not return valid recommendations. Please try again.');
  }

  // Replace the user's old recommendations with the new ones
  await query('DELETE FROM ai_recommendations WHERE user_id = $1', [userId]);
  for (const item of items) {
    let score = Number(item.score) || 0;
    score = Math.max(0, Math.min(100, score));
    await query(
      'INSERT INTO ai_recommendations (user_id, vehicle_id, reason, score, summary) VALUES ($1, $2, $3, $4, $5)',
      [userId, item.vehicleId, String(item.reason).slice(0, 300), score, String(data.summary || '').slice(0, 300)]
    );
  }
  return getSaved(userId);
}
