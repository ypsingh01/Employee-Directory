/**
 * Global Express error handling middleware and helper utilities
 * for consistent API error responses across the Employee Directory server.
 */

/**
 * Builds a standardized JSON error payload for API responses
 * @param {number} statusCode - HTTP status code to send
 * @param {string} message - Human-readable error message
 * @param {Array|undefined} details - Optional validation or field-level details
 * @returns {{ statusCode: number, message: string, details?: Array }}
 */
const buildErrorBody = (statusCode, message, details) => {
  const body = { statusCode, message };
  if (details && details.length > 0) {
    body.details = details;
  }
  return body;
};

/**
 * Express middleware that catches errors and returns JSON responses
 * @param {Error} err - Error thrown in route handlers or middleware
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  // Delegate to default handler if headers were already sent (streaming edge case)
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message =
    statusCode === 500 && !err.expose
      ? 'An unexpected error occurred on the server'
      : err.message || 'Request failed';

  const payload = buildErrorBody(statusCode, message, err.details);

  // Log server errors without leaking sensitive details to the client
  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(payload);
};

/**
 * Creates an HTTP error with status code and optional public details
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message safe to return to clients when expose is true
 * @param {{ details?: Array, expose?: boolean }} options - Additional error metadata
 * @returns {Error & { statusCode: number, details?: Array, expose?: boolean }}
 */
const createHttpError = (statusCode, message, options = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (options.details) {
    error.details = options.details;
  }
  // When true, non-500 errors can return the original message to the client
  if (typeof options.expose === 'boolean') {
    error.expose = options.expose;
  } else {
    error.expose = statusCode < 500;
  }
  return error;
};

module.exports = {
  errorHandler,
  createHttpError,
  buildErrorBody,
};
