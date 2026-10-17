// GET /api/health - used by Railway health checks and to see if the server and DB are up.
import { Router } from 'express';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', async (req, res) => {
  let database = 'not configured';
  if (env.databaseUrl) {
    try {
      await pool.query('SELECT 1');
      database = 'up';
    } catch (err) {
      database = 'down: ' + err.message;
    }
  }

  let ai = 'missing GEMINI_API_KEY';
  if (env.geminiApiKey) {
    ai = 'configured';
  }

  res.json({ status: 'ok', service: 'freeway-api', database: database, ai: ai, time: new Date().toISOString() });
});

export default router;
