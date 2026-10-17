// Rate limiters - protect the API (and our Gemini quota / budget) from abuse.
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const message = (text) => ({ error: { message: text } });

// General limit for all /api routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Too many requests, please try again later'),
});

// Login / register - slows down brute-force password guessing
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Too many login attempts, please wait 15 minutes'),
});

// AI endpoints - every call costs money, so limit per user (falls back to IP)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => (req.user ? `user-${req.user.id}` : ipKeyGenerator(req.ip)),
  message: message('AI rate limit reached (10 requests per minute). Please wait a moment.'),
});
