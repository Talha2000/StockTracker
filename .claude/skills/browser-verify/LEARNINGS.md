# browser-verify learnings

Short, dated entries. Promote repeats into SKILL.md.

## Gotchas
- 2026-09-23: Hosted API on Render cold-starts (30s+); wait for the first request instead of failing fast.
- 2026-09-24: The real API needs Mongo, so verify against the mocked API (`e2e/fixtures/mockApi.ts`) unless
  a local DB is up. Never verify against production.
- 2026-09-24: Recharts animates ~1.5s; wait ~1.5s before screenshots or the area chart looks truncated.
- 2026-09-24: Set theme before load with `page.addInitScript(() => localStorage.setItem('st.theme', ...))`.

## Faster ways
- 2026-09-24: Fastest full check: a throwaway Playwright spec (delete after) that loops viewport x theme,
  logs console errors/warnings, `pageerror`, `requestfailed` and any request to finnhub/twelvedata, and
  saves full-page screenshots to the scratchpad. Beats driving the MCP browser click by click.

## Review-derived checks
- 2026-09-24: Old UI showed `quote.pc` (previous close) as the price. Check that the displayed price equals
  the current quote (`c`), not a neighbouring field.
- 2026-09-24: Third-party news URLs must be http(s) only; check hrefs never render `javascript:` links.
