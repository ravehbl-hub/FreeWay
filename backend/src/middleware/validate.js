// Runs after express-validator rules: if any rule failed, respond 400 with a list of field errors.
import { validationResult } from 'express-validator';
import { badRequest } from '../utils/AppError.js';

export function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(badRequest('Validation failed', details));
}
