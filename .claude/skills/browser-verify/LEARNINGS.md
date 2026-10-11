# browser-verify learnings

Short, dated entries. Promote repeats into SKILL.md.

## Gotchas
- 2026-09-24 (updated 2026-10-11): The real local API talks to the same Neon database production uses (one
  branch for both, see REHAUL_PLAN 2a), so verify UI against the mocked API (`e2e/fixtures/mockApi.ts`).
  Never verify against production, and don't create throwaway users in the shared DB for screenshots.
- 2026-09-24 (updated 2026-10-11): Recharts animates the area for ~0.9s; wait ~1.2s before screenshots or
  the line looks truncated. A screenshot right after switching the range shows a half-drawn line, not a bug.
- 2026-09-24: Set theme before load with `page.addInitScript(() => localStorage.setItem('st.theme', ...))`.
- 2026-10-11: The logged-out `/users/me` probe logs a console 401 twice per page load in dev (StrictMode
  double-runs effects). Expected; a wrong-password attempt adds one more. Anything else is a real error.
- 2026-10-11: A white "Watch" button in a focus screenshot looked like a broken focus style; it was the
  button rendering "not watched" before the watchlist query resolved. When a screenshot looks wrong, log the
  element's computed style and `:focus-visible`/`:hover` state before changing CSS.

## Faster ways
- 2026-09-24: Fastest full check: a throwaway Playwright spec (delete after) that loops viewport x theme,
  logs console errors/warnings, `pageerror`, `requestfailed` and any request to finnhub/twelvedata, and
  saves full-page screenshots to the scratchpad. Beats driving the MCP browser click by click. Run it with
  `--project=desktop` and set the viewport per test, or every test runs twice.
- 2026-10-11: Override `mockApi` routes inside the throwaway spec for richer data (60 candles, news with a
  `javascript:` URL and no-image item, one falling stock). Later `page.route` registrations win.

## Review-derived checks
- 2026-09-24: Old UI showed `quote.pc` (previous close) as the price. Check that the displayed price equals
  the current quote (`c`), not a neighbouring field.
- 2026-09-24: Third-party news URLs must be http(s) only; check hrefs never render `javascript:` links.
- 2026-10-11: Intraday candles: check the chart's x-axis doesn't repeat a date label (needs day-boundary
  ticks, not one per point).
- 2026-10-11: Schibsted Grotesk's tabular figures look typewriter-like at display sizes. Use `tabular`
  only where numbers must align in a column (watchlist); check large prices aren't gappy.
- 2026-10-11: Any control whose label depends on a query (Watch/Watching) must not flash the wrong state
  while loading; check the first paint, not just the settled page.
