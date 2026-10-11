const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const TWELVEDATA_BASE = 'https://api.twelvedata.com';
const SYMBOL_RE = /^[A-Za-z0-9.\-:^]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const INT_RE = /^\d{1,12}$/;
const RESOLUTION_RE = /^(1|5|15|30|60|D|W|M)$/;

// Finnhub's resolution codes (what the client already sends) mapped to
// Twelve Data's interval strings.
const RESOLUTION_TO_INTERVAL = {
  1: '1min',
  5: '5min',
  15: '15min',
  30: '30min',
  60: '1h',
  D: '1day',
  W: '1week',
  M: '1month',
};

// Every market-data route is proxied and cached; without this a client could
// hammer /api/market/* and burn the whole day's Finnhub/Twelve Data quota.
router.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Best-effort only: this is a serverless function, so the cache lives only as
// long as a warm instance does and isn't shared across instances. Still cuts
// duplicate upstream calls within a burst, for free, with no extra service.
const cache = new Map();
const withCache = (ttlMs, keyFn, handler) => async (req, res) => {
  const key = keyFn(req);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return res.status(hit.status).json(hit.body);
  }
  // A minimal res stand-in: the wrapped handlers only ever call
  // res.status(code).json(body), so that's all this needs to implement.
  let pendingStatus = 200;
  const captureRes = {
    status(code) {
      pendingStatus = code;
      return captureRes;
    },
    json(body) {
      // Only cache success responses — an upstream hiccup shouldn't get
      // "pinned" and served to everyone else for the next several minutes.
      if (pendingStatus < 400) {
        cache.set(key, { status: pendingStatus, body, expires: Date.now() + ttlMs });
      }
      return res.status(pendingStatus).json(body);
    },
  };
  return handler(req, captureRes);
};

// Forwards a validated request to Finnhub. The key is read from the server environment only.
const forward = (path, buildParams) => async (req, res) => {
  const key = process.env.FINNHUB_KEY;
  if (!key) return res.status(500).json({ message: 'Market data is not configured' });

  const params = buildParams(req.query);
  if (!params) return res.status(400).json({ message: 'Invalid query parameters' });

  try {
    const url = `${FINNHUB_BASE}${path}?${new URLSearchParams(params)}`;
    const upstream = await fetch(url, { headers: { 'X-Finnhub-Token': key } });
    const body = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json(body);
  } catch (err) {
    console.error('Market data request failed:', err.message);
    return res.status(502).json({ message: 'Market data provider unavailable' });
  }
};

const symbolOnly = (q) => (SYMBOL_RE.test(q.symbol ?? '') ? { symbol: q.symbol } : null);

router.get(
  '/search',
  withCache(5 * 60_000, (req) => `search:${req.query.q}`, forward('/search', (q) =>
    typeof q.q === 'string' && q.q.length > 0 && q.q.length <= 50 ? { q: q.q } : null)),
);
router.get(
  '/quote',
  withCache(20_000, (req) => `quote:${req.query.symbol}`, forward('/quote', symbolOnly)),
);
router.get(
  '/profile',
  withCache(60 * 60_000, (req) => `profile:${req.query.symbol}`, forward('/stock/profile2', symbolOnly)),
);
router.get(
  '/news',
  withCache(5 * 60_000, (req) => `news:${req.query.symbol}:${req.query.from}:${req.query.to}`, forward('/company-news', (q) =>
    SYMBOL_RE.test(q.symbol ?? '') && DATE_RE.test(q.from ?? '') && DATE_RE.test(q.to ?? '')
      ? { symbol: q.symbol, from: q.from, to: q.to }
      : null)),
);

// Finnhub's candle endpoint is paid-tier; Twelve Data serves historical
// candles on its free tier. Response is reshaped to the same { s, c, t }
// Finnhub-candle shape the client already expects, so nothing downstream
// (useCandles, candlesSchema) needed to change.
const candles = async (req, res) => {
  const key = process.env.TWELVEDATA_KEY;
  if (!key) return res.status(500).json({ message: 'Market data is not configured' });

  const { symbol, resolution, from, to } = req.query;
  if (!SYMBOL_RE.test(symbol ?? '') || !RESOLUTION_RE.test(resolution ?? '') ||
      !INT_RE.test(from ?? '') || !INT_RE.test(to ?? '')) {
    return res.status(400).json({ message: 'Invalid query parameters' });
  }

  const interval = RESOLUTION_TO_INTERVAL[resolution];
  // Twelve Data takes a count, not a date range; pad generously for the
  // widest interval/range combination this app currently requests (1 month
  // of hourly bars) and let the client-side from/to filtering do the rest.
  const outputsize = 1000;

  try {
    const url = `${TWELVEDATA_BASE}/time_series?${new URLSearchParams({
      symbol,
      interval,
      outputsize: String(outputsize),
      apikey: key,
    })}`;
    const upstream = await fetch(url);
    const body = await upstream.json().catch(() => ({}));

    if (body.status === 'error' || !Array.isArray(body.values)) {
      // Unknown symbol, bad interval for that symbol's plan, etc. — same
      // "no data" shape the client already handles for an empty range.
      return res.status(200).json({ s: 'no_data' });
    }

    const fromSec = Number(from);
    const toSec = Number(to);
    // Twelve Data returns newest first; the client expects ascending time.
    const points = body.values
      .map((v) => ({
        // Daily+ bars are "YYYY-MM-DD"; intraday bars are "YYYY-MM-DD HH:mm:ss".
        // Twelve Data times are exchange-local but unlabeled; treated as UTC
        // here, consistent with how Finnhub's unix timestamps were used.
        t: Math.floor(
          new Date(v.datetime.includes(' ') ? `${v.datetime.replace(' ', 'T')}Z` : `${v.datetime}T00:00:00Z`).getTime() / 1000,
        ),
        c: Number(v.close),
      }))
      .filter((p) => p.t >= fromSec && p.t <= toSec)
      .sort((a, b) => a.t - b.t);

    return res.status(200).json({
      s: 'ok',
      t: points.map((p) => p.t),
      c: points.map((p) => p.c),
    });
  } catch (err) {
    console.error('Market data request failed:', err.message);
    return res.status(502).json({ message: 'Market data provider unavailable' });
  }
};
router.get(
  '/candles',
  withCache(5 * 60_000, (req) => `candles:${req.query.symbol}:${req.query.resolution}:${req.query.from}:${req.query.to}`, candles),
);

module.exports = router;
