# self-review learnings

- 2026-09-23: Finnhub API key was hardcoded in two client files and committed. Never put provider keys in
  client code; proxy through the API. (Key must be rotated: it is in git history.)
- 2026-09-23: Finnhub `/stock/candle` is paid-tier; do not build features on it.
