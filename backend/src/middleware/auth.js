// Authentication & authorization middleware.
// requireAuth: verifies the JWT from "Authorization: Bearer <token>" and puts the user on req.user.
// requireRole: allows only the given roles (e.g. 'admin').
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { unauthorized, forbidden } from '../utils/AppError.js';

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(unauthorized());

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.userId, role: payload.role, name: payload.name, email: payload.email };
    next();
  } catch {
    next(unauthorized('Invalid or expired token, please log in again'));
  }
}

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  if (!roles.includes(req.user.role)) return next(forbidden());
  next();
};
