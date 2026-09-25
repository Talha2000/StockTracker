# e2e-testing learnings

- 2026-09-24: Suite lives in `stock-tracker/e2e`; shared mocks in `e2e/fixtures/mockApi.ts` (login, watchlist,
  quote, profile, news, candles, search). Extend that file instead of mocking ad hoc per test.
- 2026-09-24: `playwright.config.ts` starts `npm run dev` itself; API is fully mocked so no backend needed.
- 2026-09-24: Run `npx playwright install chromium` once on a fresh machine.
- 2026-09-24: Playwright `webServer` reuses a running dev server locally, so a stale server can mask config
  changes; restart it after editing `vite.config.ts`.
- Gaps to fill next: register flow, watchlist add/remove round-trip, portfolio page, search, theme toggle,
  API 500/429 error states, axe accessibility checks.
