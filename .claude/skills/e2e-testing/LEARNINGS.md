# e2e-testing learnings

- 2026-09-24: Suite lives in `stock-tracker/e2e`; shared mocks in `e2e/fixtures/mockApi.ts` (login, watchlist,
  quote, profile, news, candles, search). Extend that file instead of mocking ad hoc per test.
- 2026-09-24: `playwright.config.ts` starts `npm run dev` itself; API is fully mocked so no backend needed.
- 2026-09-24: Run `npx playwright install chromium` once on a fresh machine.
- 2026-09-24: Playwright `webServer` reuses a running dev server locally, so a stale server can mask config
  changes; restart it after editing `vite.config.ts`.
- Gaps to fill next: watchlist add/remove round-trip, search, theme toggle, chart range switching,
  API 500/429 error states, axe accessibility checks. (Register flow and the watchlist page, including the
  old `/portfolio` redirect, now covered.)
- 2026-10-11: Phase 3 kept every heading and aria-label the suite selects on ("Sign in to your account",
  "Sign up", `heading META`, "Remove META from watchlist"). Grep the spec for visible text before changing
  copy, and `getByText` must stay unique (the company name is in the hero only, not repeated in Key facts).
- 2026-10-11: Mocks can't catch everything, specifically real cookie/redirect interactions — found a real
  bug (global 401 handler firing for an expected 401, force-navigating every page to /login) only by
  running the actual flow in a real browser against the real local API. When a mock replaces a mechanism
  the app depends on for *correctness*, not just data (here: real Set-Cookie/cookie-jar behavior across a
  cross-origin request), a passing mocked suite doesn't prove that mechanism works — sanity-check the real
  thing at least once for any auth/session change, even though the mocked suite stays the fast day-to-day
  check.
- 2026-10-11: When two different situations both redirect to the same place (an expired session and an
  always-true auth gate both send you to /login), a test asserting only "ends up at the right place" can
  pass for the wrong reason and hide a real bug. Added `auth-and-dashboard.spec.ts`'s "visiting /register
  while logged out stays on /register" specifically to assert a case that should *not* redirect — that's
  the shape of test this bug needed, not another "redirects to login" assertion.
- 2026-10-11: `mockApi()` fakes an httpOnly-cookie-style session with a plain closure variable
  (`loggedInAs`) shared across its `/login`, `/logout`, and `/users/me` route handlers, rather than trying
  to fabricate a real cookie — Playwright's mocked responses don't need to replicate the Set-Cookie
  mechanics, only the resulting state-dependent behavior each route should show.
