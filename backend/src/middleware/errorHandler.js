// Central error handling: 404 for unknown routes, and one function that turns any error into a JSON response.
import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, res, next) {
  next(new AppError(404, 'Route not found: ' + req.method + ' ' + req.originalUrl));
}

export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Translate common PostgreSQL error codes to HTTP status codes
  if (err.code === '23505') {
    status = 409;
    message = 'This record already exists';
  } else if (err.code === '23503') {
    status = 400;
    message = 'Related record does not exist';
  } else if (err.code === '23514') {
    status = 400;
    message = 'Value is not allowed';
  } else if (err.code === 'ECONNREFUSED' || err.code === '28P01' || err.code === '3D000' || err.code === 'ENOTFOUND') {
    status = 503;
    message = 'Database is unavailable';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body';
  }

  // Don't leak internal details of unexpected errors
  if (status === 500 && !(err instanceof AppError)) {
    message = 'Internal server error';
  }

  const body = { error: { message: message } };
  if (err.details) {
    body.error.details = err.details;
  }
  res.status(status).json(body);
}
