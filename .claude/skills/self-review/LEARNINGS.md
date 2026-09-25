# self-review learnings

- 2026-09-23: Finnhub API key was hardcoded in two client files and committed. Never put provider keys in
  client code; proxy through the API. (Key must be rotated: it was public on GitHub.)
- 2026-09-23: Finnhub `/stock/candle` is paid-tier; do not build features on it.
- 2026-09-24: Bug class "wrong field displayed": old Overview showed previous close (`pc`) as the price.
  Re-check field mapping whenever porting or touching quote/profile displays.
- 2026-09-24: React 19 deprecates `FormEvent` (use `SubmitEvent`); strictTypeChecked lint catches this.
- 2026-09-24: Tooling: `typescript-eslint` rejects TypeScript 7, so keep `typescript@~6`. `@testing-library/dom`
  is a required peer of jest-dom/react; install it explicitly.
- 2026-09-24: Old `auth` re-validated the token against `/users/me` before every request; replaced by a single
  axios interceptor + 401 handler. Avoid per-call auth round trips.
- 2026-09-24: Old API `errorHandler` is registered before the routes so it never runs (Phase 2 fix).
