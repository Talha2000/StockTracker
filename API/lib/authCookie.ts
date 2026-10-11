import type { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'access_token';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

// Client and API are different registrable domains in production
// (mystocktracker.vercel.app vs stock-tracker-lake-tau.vercel.app), so the
// cookie needs SameSite=None + Secure there. Locally they're different
// ports on the same host (localhost:3000 -> localhost:5001) — SameSite's
// "site" comparison ignores port, so they already count as same-site, and
// `Secure` cookies are frequently dropped by browsers over plain http
// anyway. Branch so local dev keeps working without HTTPS.
const isProduction = process.env.NODE_ENV === 'production';

// Must stay identical between the res.cookie() call at login and the
// res.clearCookie() call at logout — a mismatched attribute (path,
// sameSite, secure...) means clearCookie silently fails to remove it.
export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
};

export const authCookieMaxAge = TWO_HOURS_MS;
