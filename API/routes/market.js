const express = require('express');
const router = express.Router();

const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const SYMBOL_RE = /^[A-Za-z0-9.\-:^]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const INT_RE = /^\d{1,12}$/;
const RESOLUTION_RE = /^(1|5|15|30|60|D|W|M)$/;

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

router.get('/search', forward('/search', (q) =>
  typeof q.q === 'string' && q.q.length > 0 && q.q.length <= 50 ? { q: q.q } : null));
router.get('/quote', forward('/quote', symbolOnly));
router.get('/profile', forward('/stock/profile2', symbolOnly));
router.get('/candles', forward('/stock/candle', (q) =>
  SYMBOL_RE.test(q.symbol ?? '') && RESOLUTION_RE.test(q.resolution ?? '') &&
  INT_RE.test(q.from ?? '') && INT_RE.test(q.to ?? '')
    ? { symbol: q.symbol, resolution: q.resolution, from: q.from, to: q.to }
    : null));
router.get('/news', forward('/company-news', (q) =>
  SYMBOL_RE.test(q.symbol ?? '') && DATE_RE.test(q.from ?? '') && DATE_RE.test(q.to ?? '')
    ? { symbol: q.symbol, from: q.from, to: q.to }
    : null));

module.exports = router;
