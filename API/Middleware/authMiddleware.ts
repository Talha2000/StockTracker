import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE_NAME } from '../lib/authCookie';
import type { AuthUser } from '../types/express';

// Reads the session from the httpOnly cookie login sets (see authController),
// not an Authorization header — the client never has direct access to the
// token at all now, so there is nothing for it to attach to a request.
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const token = cookies?.[AUTH_COOKIE_NAME];
  if (typeof token !== 'string') {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const secret = process.env.ACCESS_TOKEN;
  if (!secret) {
    console.error('ACCESS_TOKEN is not configured');
    res.status(500).json({ message: 'Server misconfigured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthUser;
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
