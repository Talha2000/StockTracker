import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import type { ZodType } from 'zod';
import {
  finnhubNewsSchema,
  finnhubProfileSchema,
  finnhubQuoteSchema,
  finnhubSearchSchema,
  twelveDataErrorSchema,
  twelveDataTimeSeriesSchema,
} from '../lib/upstreamSchemas';

const router = Router();

const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const TWELVEDATA_BASE = 'https://api.twelvedata.com';
const SYMBOL_RE = /^[A-Za-z0-9.\-:^]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const INT_RE = /^\d{1,12}$/;
const RESOLUTION_RE = /^(1|5|15|30|60|D|W|M)$/;

// Finnhub's resolution codes (what the client already sends) mapped to
// Twelve Data's interval strings.
const RESOLUTION_TO_INTERVAL: Record<string, string> = {
  '1': '1min',
  '5': '5min',
  '15': '15min',
  '30': '30min',
  '60': '1h',
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

// A minimal res stand-in: every wrapped handler only ever calls
// res.status(code).json(body), so that's all this needs to implement.
interface CaptureRes {
  status(code: number): CaptureRes;
  json(body: unknown): void;
}
type Handler = (req: Request, res: CaptureRes) => Promise<void>;

interface CacheEntry {
  status: number;
  body: unknown;
  expires: number;
}

// Best-effort only: this is a serverless function, so the cache lives only as
// long as a warm instance does and isn't shared across instances. Still cuts
// duplicate upstream calls within a burst, for free, with no extra service.
const cache = new Map<string, CacheEntry>();
const withCache =
  (ttlMs: number, keyFn: (req: Request) => string, handler: Handler) =>
  async (req: Request, res: Response): Promise<void> => {
    const key = keyFn(req);
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) {
      res.status(hit.status).json(hit.body);
      return;
    }

    let pendingStatus = 200;
    const captureRes: CaptureRes = {
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
        res.status(pendingStatus).json(body);
      },
    };
    await handler(req, captureRes);
  };

type QueryParams = Record<string, string | undefined>;

// req.query values can be string | ParsedQs | (string | ParsedQs)[] | undefined
// (query strings can parse into nested objects/arrays); naively stringifying
// one of those produces "[object Object]" instead of something useful in a
// cache key. This only ever accepts the plain-string case.
const queryString = (value: unknown): string => (typeof value === 'string' ? value : '');

// Forwards a validated request to Finnhub, then validates the *response*
// shape against `schema` before relaying it — previously the server trusted
// whatever Finnhub sent back unchecked.
const forward =
  <T>(
    path: string,
    buildParams: (q: QueryParams) => Record<string, string> | null,
    schema: ZodType<T>,
  ): Handler =>
  async (req, res) => {
    const key = process.env.FINNHUB_KEY;
    if (!key) {
      res.status(500).json({ message: 'Market data is not configured' });
      return;
    }

    const params = buildParams(req.query as QueryParams);
    if (!params) {
      res.status(400).json({ message: 'Invalid query parameters' });
      return;
    }

    try {
      const url = `${FINNHUB_BASE}${path}?${new URLSearchParams(params).toString()}`;
      const upstream = await fetch(url, { headers: { 'X-Finnhub-Token': key } });
      const body: unknown = await upstream.json().catch(() => ({}));

      if (upstream.ok) {
        const result = schema.safeParse(body);
        if (!result.success) {
          console.error('Unexpected Finnhub response shape:', result.error.message);
          res.status(502).json({ message: 'Market data provider returned unexpected data' });
          return;
        }
      }
      res.status(upstream.status).json(body);
    } catch (err) {
      console.error('Market data request failed:', err instanceof Error ? err.message : err);
      res.status(502).json({ message: 'Market data provider unavailable' });
    }
  };

const symbolOnly = (q: QueryParams): Record<string, string> | null => {
  const symbol = q.symbol ?? '';
  return SYMBOL_RE.test(symbol) ? { symbol } : null;
};

router.get(
  '/search',
  withCache(
    5 * 60_000,
    (req) => `search:${queryString(req.query.q)}`,
    forward(
      '/search',
      (q) => (typeof q.q === 'string' && q.q.length > 0 && q.q.length <= 50 ? { q: q.q } : null),
      finnhubSearchSchema,
    ),
  ),
);
router.get(
  '/quote',
  withCache(20_000, (req) => `quote:${queryString(req.query.symbol)}`, forward('/quote', symbolOnly, finnhubQuoteSchema)),
);
router.get(
  '/profile',
  withCache(
    60 * 60_000,
    (req) => `profile:${queryString(req.query.symbol)}`,
    forward('/stock/profile2', symbolOnly, finnhubProfileSchema),
  ),
);
router.get(
  '/news',
  withCache(
    5 * 60_000,
    (req) => `news:${queryString(req.query.symbol)}:${queryString(req.query.from)}:${queryString(req.query.to)}`,
    forward(
      '/company-news',
      (q) => {
        const symbol = q.symbol ?? '';
        const from = q.from ?? '';
        const to = q.to ?? '';
        return SYMBOL_RE.test(symbol) && DATE_RE.test(from) && DATE_RE.test(to) ? { symbol, from, to } : null;
      },
      finnhubNewsSchema,
    ),
  ),
);

// Finnhub's candle endpoint is paid-tier; Twelve Data serves historical
// candles on its free tier. Response is reshaped to the same { s, c, t }
// Finnhub-candle shape the client already expects, so nothing downstream
// (useCandles, candlesSchema) needed to change.
const candles: Handler = async (req, res) => {
  const key = process.env.TWELVEDATA_KEY;
  if (!key) {
    res.status(500).json({ message: 'Market data is not configured' });
    return;
  }

  const query = req.query as QueryParams;
  const symbol = query.symbol ?? '';
  const resolution = query.resolution ?? '';
  const from = query.from ?? '';
  const to = query.to ?? '';
  if (!SYMBOL_RE.test(symbol) || !RESOLUTION_RE.test(resolution) || !INT_RE.test(from) || !INT_RE.test(to)) {
    res.status(400).json({ message: 'Invalid query parameters' });
    return;
  }

  // RESOLUTION_RE above already restricts `resolution` to exactly the keys
  // RESOLUTION_TO_INTERVAL has, but TS can't infer that from a regex test —
  // this is the runtime backstop for "should be impossible" so a future
  // change to one list without the other fails loudly instead of sending
  // Twelve Data interval=undefined.
  const interval = RESOLUTION_TO_INTERVAL[resolution];
  if (!interval) {
    console.error(`No Twelve Data interval mapped for resolution "${resolution}"`);
    res.status(500).json({ message: 'Server misconfigured' });
    return;
  }
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
    }).toString()}`;
    const upstream = await fetch(url);
    const body: unknown = await upstream.json().catch(() => ({}));

    const errorResult = twelveDataErrorSchema.safeParse(body);
    const okResult = twelveDataTimeSeriesSchema.safeParse(body);
    if (errorResult.success || !okResult.success) {
      // Unknown symbol, bad interval for that symbol's plan, or a shape we
      // don't recognize — same "no data" shape the client already handles
      // for an empty range, rather than forwarding whatever came back.
      res.status(200).json({ s: 'no_data' });
      return;
    }

    const fromSec = Number(from);
    const toSec = Number(to);
    // Twelve Data returns newest first; the client expects ascending time.
    const points = okResult.data.values
      .map((v) => ({
        // Daily+ bars are "YYYY-MM-DD"; intraday bars are "YYYY-MM-DD HH:mm:ss".
        // Twelve Data times are exchange-local but unlabeled; treated as UTC
        // here, consistent with how Finnhub's unix timestamps were used.
        t: Math.floor(
          new Date(
            v.datetime.includes(' ') ? `${v.datetime.replace(' ', 'T')}Z` : `${v.datetime}T00:00:00Z`,
          ).getTime() / 1000,
        ),
        c: Number(v.close),
      }))
      .filter((p) => p.t >= fromSec && p.t <= toSec)
      .sort((a, b) => a.t - b.t);

    res.status(200).json({
      s: 'ok',
      t: points.map((p) => p.t),
      c: points.map((p) => p.c),
    });
  } catch (err) {
    console.error('Market data request failed:', err instanceof Error ? err.message : err);
    res.status(502).json({ message: 'Market data provider unavailable' });
  }
};
router.get(
  '/candles',
  withCache(
    5 * 60_000,
    (req) =>
      `candles:${queryString(req.query.symbol)}:${queryString(req.query.resolution)}:${queryString(req.query.from)}:${queryString(req.query.to)}`,
    candles,
  ),
);

export default router;
