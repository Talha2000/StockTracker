import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../lib/httpError';

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  // res.statusCode defaults to 200 before anything sets it — the original JS
  // version did `res.statusCode ? res.statusCode : 500`, and since 200 is
  // truthy, the `: 500` branch was dead code and every error response came
  // back HTTP 200. Prefer an explicit status carried by the error itself,
  // then only trust res.statusCode if a route actually changed it from the
  // 200 default, and fall back to 500.
  const statusCode =
    err instanceof HttpError ? err.statusCode : res.statusCode !== 200 ? res.statusCode : 500;

  const message = err instanceof Error ? err.message : 'An error occurred.';
  const stack = err instanceof Error ? err.stack : undefined;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : stack,
  });
};
