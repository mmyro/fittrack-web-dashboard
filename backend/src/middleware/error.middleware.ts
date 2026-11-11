import { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new ApiError(404, 'Route not found'));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors });
    return;
  }

  // Malformed JSON body (thrown by express.json)
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON body', errors: [] });
    return;
  }

  // Duplicate key (unique index), e.g. two registrations at the same time
  if (err?.code === 11000) {
    res.status(409).json({ message: 'Email already registered', errors: [] });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error', errors: [] });
};