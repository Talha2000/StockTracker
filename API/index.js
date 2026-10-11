const express = require('express');
const prisma = require('./db'); // Prisma client (Neon Postgres); also exports connectDB()
const cookieParser = require('cookie-parser')
const {errorHandler} = require('./Middleware/errorHandler')
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config(); // Load API/.env into process.env
dotenv.config({ path: require('path').join(__dirname, '..', '.env') }); // Repo-root .env (FINNHUB_KEY, DATABASE_URL)

const app = express()

// This is a pure JSON API called cross-origin by the client (a different
// Vercel project/domain), so two of helmet's defaults need overriding:
// - crossOriginResourcePolicy defaults to 'same-origin', which browsers can
//   enforce even on a CORS-permitted fetch — would silently break the
//   client's real requests despite the cors() allowlist above saying yes.
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
        const err = new Error(`Origin ${origin} is not allowed`);
        err.statusCode = 403;
        callback(err);
      }
    },
  }),
);

app.use(cookieParser())

app.use((req, res, next) => {
  console.log(`In router: ${req.method}:${req.originalUrl}`);
  next();
});

app.use(express.json())
app.use(express.urlencoded({extended: false}));

const AuthRoutes = require('./routes/auth');
app.use('/api/auth', AuthRoutes);

const StockRoutes = require('./routes/stock');
app.use('/api/stock', StockRoutes);

const MarketRoutes = require('./routes/market');
app.use('/api/market', MarketRoutes);

const UserRoutes = require('./routes/users');
app.use('/api/users', UserRoutes);

app.get("/", (req, res) => {
  res.json("hello this is the backend")
})

// Must be registered after every route: Express only treats a 4-arg
// middleware as an error handler, and only errors from routes before it
// reach it. It was previously registered before the routes, so it never ran.
app.use(errorHandler);

// Vercel imports this file for its request handler (see api/index.js) and
// never runs it directly, so app.listen()/connectDB() only happen for a
// traditional host (Render) or local dev (`npm run devStart`).
if (require.main === module) {
  prisma.connectDB().catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });
  app.listen(process.env.PORT || 5001, () => {
    console.log(`Server running on port ${process.env.PORT || 5001}`);
  });
}

module.exports = app;