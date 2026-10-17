// Reads all environment variables (.env) in one place, with default values.
import 'dotenv/config';

const corsList = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: corsList.split(',').map((origin) => origin.trim()),
  databaseUrl: process.env.DATABASE_URL || '',
  dbSsl: process.env.DB_SSL === 'true',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS) || 20000,
};
