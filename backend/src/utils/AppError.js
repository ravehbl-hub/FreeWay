// Custom error class that carries an HTTP status code. Thrown from services/controllers,
// caught by the central errorHandler middleware.
export class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const badRequest = (msg, details) => new AppError(400, msg, details);
export const unauthorized = (msg = 'Authentication required') => new AppError(401, msg);
export const forbidden = (msg = 'You do not have permission to do this') => new AppError(403, msg);
export const notFound = (msg = 'Resource not found') => new AppError(404, msg);
export const conflict = (msg) => new AppError(409, msg);
