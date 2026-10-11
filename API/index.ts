import path from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { connectDB } from './db';
import { errorHandler } from './Middleware/errorHandler';
import { HttpError } from './lib/httpError';
import authRoutes from './routes/auth';
import marketRoutes from './routes/market';
import stockRoutes from './routes/stock';
import userRoutes from './routes/users';

// __dirname here is API/ when run from source (tsx) but API/dist/ once
// compiled (see tsconfig's outDir) — load both candidate repo-root paths;
// dotenv.config() is a silent no-op if a path doesn't exist, so this is safe
// in either layout rather than needing to know which one is active.
dotenv.config(); // API/.env, if present
dotenv.config({ path: path.join(__dirname, '..', '.env') }); // repo root, when __dirname is API/
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') }); // repo root, when __dirname is API/dist/

const app = express();

// This is a pure JSON API called cross-origin by the client (a different
// Vercel project/domain), so two of helmet's defaults need overriding:
// - crossOriginResourcePolicy defaults to 'same-origin', which browsers can
//   enforce even on a CORS-permitted fetch — would silently break the
//   client's real requests despite the cors() allowlist below saying yes.
// - contentSecurityPolicy is meant for pages that render HTML/run scripts;
//   this API never does, and helmet's default CSP has no useful effect here.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }),
);

// Was previously just cors() (any origin) followed by a manual middleware
// that unconditionally set Access-Control-Allow-Origin: * AFTER cors() ran —
// Express/Node replace a header on a second res.header() call for the same
// name, so that manual line silently overwrote whatever cors() computed and
// allowed every origin regardless of this allowlist. Removed; cors() now
// owns the header entirely.
const defaultAllowedOrigins = ['http://localhost:3000', 'https://mystocktracker.vercel.app'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : defaultAllowedOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = same-origin, curl, or a server-to-server call — allow it.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new HttpError(`Origin ${origin} is not allowed`, 403));
      }
    },
    // Needed now that auth is an httpOnly cookie, not a bearer token: the
    // browser only sends/accepts cookies cross-origin with this set (and the
    // client's axios instance sets withCredentials to match). cors() refuses
    // to pair this with origin: '*', which is exactly why the allowlist
    // above always reflects back a specific origin rather than '*'.
    credentials: true,
  }),
);

app.use(cookieParser());

app.use((req, _res, next) => {
  console.log(`In router: ${req.method}:${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
  res.json('hello this is the backend');
});

// Must be registered after every route: Express only treats a 4-arg
// middleware as an error handler, and only errors from routes before it
// reach it. It was previously registered before the routes, so it never ran.
app.use(errorHandler);

// Vercel imports this file for its request handler (see api/index.js) and
// never runs it directly, so app.listen()/connectDB() only happen for a
// traditional host or local dev (`npm run devStart`).
if (require.main === module) {
  connectDB().catch((err: unknown) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });
  const port = process.env.PORT ?? 5001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
