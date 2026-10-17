// AI recommendations controller
import * as aiRecommendationsService from '../services/aiRecommendations.service.js';

// Returns the recommendations already saved in the DB (fast, no AI call)
export async function getSaved(req, res, next) {
  try {
    const recommendations = await aiRecommendationsService.getSaved(req.user.id);
    res.json({ recommendations: recommendations });
  } catch (err) {
    next(err);
  }
}

// Asks Gemini for new recommendations and saves them
export async function generate(req, res, next) {
  try {
    const recommendations = await aiRecommendationsService.generate(req.user.id);
    res.status(201).json({ recommendations: recommendations });
  } catch (err) {
    next(err);
  }
}
