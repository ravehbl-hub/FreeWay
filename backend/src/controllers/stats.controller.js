// Stats controller
import * as statsService from '../services/stats.service.js';

export async function myStats(req, res, next) {
  try {
    const stats = await statsService.getUserStats(req.user.id);
    res.json({ stats: stats });
  } catch (err) {
    next(err);
  }
}

export async function adminStats(req, res, next) {
  try {
    const stats = await statsService.getAdminStats();
    res.json({ stats: stats });
  } catch (err) {
    next(err);
  }
}
