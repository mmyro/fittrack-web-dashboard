import { RequestHandler } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';

function buildErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

export const validate =
  (schema: z.ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ApiError(400, 'Validation failed', buildErrors(result.error)));
    }

    req.body = result.data;
    next();
  };

export const validateQuery =
  (schema: z.ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(new ApiError(400, 'Validation failed', buildErrors(result.error)));
    }

    // Express 5 makes req.query read-only, so the parsed values go in res.locals
    res.locals.query = result.data;
    next();
  };