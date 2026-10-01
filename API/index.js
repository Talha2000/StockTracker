const express = require('express');
const prisma = require('./db'); // Prisma client (Neon Postgres); also exports connectDB()
const cookieParser = require('cookie-parser')
const {errorHandler} = require('./Middleware/errorHandler')
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load API/.env into process.env
dotenv.config({ path: require('path').join(__dirname, '..', '.env') }); // Repo-root .env (FINNHUB_KEY, DATABASE_URL)

const app = express()
app.use(cors());

app.use(cookieParser())

app.use((req, res, next) => {
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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