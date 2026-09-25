---
name: e2e-testing
description: Write, run and maintain the Playwright end-to-end test suite for StockTracker (auth, search, watchlist, stock detail, portfolio, theme, responsive). Use when adding features, fixing bugs that need regression coverage, or when asked to run or fix e2e tests.
---

# e2e-testing

Suite lives in `stock-tracker/e2e/` using `@playwright/test`, config in `playwright.config.ts`.

## Rules
1. **Mock third-party market data** with `page.route` fixtures (`e2e/fixtures/`). Tests must never hit
   Finnhub/Twelve Data or depend on live prices. Use a seeded test user against a local API/test DB, never prod.
2. Locators: `getByRole` / `getByLabel` / `getByText` first; `data-testid` only when needed. No CSS selectors,
   no fixed `waitForTimeout`; rely on auto-waiting and `expect(...).toBeVisible()`.
3. One behavior per test, independent and order-free. Share login via `storageState` set up once.
4. Cover per feature: happy path, empty state, error state (mock 500/429), loading skeleton.
5. Run projects: chromium desktop and a mobile viewport. Add visual snapshots only for stable components.
6. Add an `@axe-core/playwright` accessibility check to each page test.

## Commands
`npx playwright test`, `npx playwright test --ui`, `npx playwright show-report`, `npx playwright codegen <url>`.

## Fixing failures
Read the trace (`--trace on`), fix the root cause. Never "fix" by loosening the assertion or adding sleeps
unless the behavior itself legitimately changed.

## Keeping this skill current
Append lessons (flaky causes, fixture tricks, slow setups) to [LEARNINGS.md](LEARNINGS.md). At each phase
end, update commands/paths above to match the repo, promote repeated lessons into Rules, prune the rest.
Pair with `browser-verify`: ad-hoc checks that prove valuable become permanent tests here.
