import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import prisma from '../db';
import { AUTH_COOKIE_NAME, authCookieMaxAge, authCookieOptions } from '../lib/authCookie';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body as { username?: unknown; password?: unknown };

  if (typeof username !== 'string' || username.trim().length < 3 || username.length > 30) {
    return res.status(400).json('Username must be between 3 and 30 characters.');
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json('Password must be at least 8 characters.');
  }

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json('User already exists!');
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hash } });

    return res.status(200).json('User has been created!');
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ message: 'An error occurred.', error: message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body as { username?: unknown; password?: unknown };
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json('Username and password are required.');
  }

  const secret = process.env.ACCESS_TOKEN;
  if (!secret) {
    console.error('ACCESS_TOKEN is not configured');
    return res.status(500).json({ message: 'Server misconfigured' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json('User not found!');
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).json('Wrong username or password!');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '2h' });

    // httpOnly: the client never sees the token value, only this cookie
    // being set — it can't be read by injected/XSS'd JS, unlike the old
    // sessionStorage-based token the client used to manage itself.
    res.cookie(AUTH_COOKIE_NAME, token, { ...authCookieOptions, maxAge: authCookieMaxAge });
    return res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  // Must match login's cookie attributes exactly (path, sameSite, secure) —
  // a mismatched attribute means the browser won't recognize this as the
  // same cookie and silently won't clear it.
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions).status(200).json('User has been logged out.');
};
