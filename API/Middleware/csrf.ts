import type { NextFunction, Request, Response } from 'express';

// Auth is a SameSite=None cookie in production (required for a different
// registrable domain than the client), which browsers will attach to a
// cross-site request regardless of CORS. CORS itself only governs whether
// cross-origin *JavaScript* can read a response, not whether a plain HTML
// form submission reaches the server with cookies attached — a classic CSRF
// vector. In practice a bare form POST already fails here today, since
// Express only parses an `application/json` body and a form can't send one,
// but that's incidental to body-parsing config, not a deliberate defense.
// Requiring this header is: cheap (our own client always sends it, see
// lib/api.ts), and something only same-origin-or-CORS-permitted JavaScript
// can set — a cross-site form or `<img>`/simple-request style attack cannot.
export const requireCsrfHeader = (req: Request, res: Response, next: NextFunction): void => {
  if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
    res.status(403).json({ message: 'Missing required header' });
    return;
  }
  next();
};
