---
name: browser-verify
description: Launch the StockTracker app and verify a change works in a real browser with Playwright (screenshots, console errors, network failures, responsive and theme checks). Use after any UI or client-API change, or when asked to confirm something works in the real app. Self-improving: records lessons in LEARNINGS.md.
---

# browser-verify

Goal: prove the change works by using the app, not by reading code.

## Before you start
1. Read [LEARNINGS.md](LEARNINGS.md) in this folder and apply every entry.
2. Start the dev servers if not running (client via `npm run dev` in `stock-tracker/`, API via `npm start`
   in `API/`). Use background runs; wait for the port instead of sleeping blindly.

## Preferred method
Write a throwaway Playwright spec (delete it afterward) that mocks the API via `e2e/fixtures/mockApi.ts`, loops
viewport x theme, records console errors/warnings, `pageerror`, `requestfailed` and direct provider calls, and
saves screenshots to the scratchpad; then read the screenshots. Use the MCP tools below for interactive poking.

## Procedure (Playwright MCP tools: `browser_navigate`, `browser_snapshot`, `browser_click`, etc.)
1. Navigate to the affected route. Prefer `browser_snapshot` (accessibility tree) over screenshots for
   assertions; take screenshots only as evidence.
2. Exercise the changed flow end to end (click, type, submit). Include one unhappy path (bad input,
   API 4xx/5xx, empty state).
3. Check `browser_console_messages` (no errors/warnings) and `browser_network_requests` (no failed calls,
   no API keys in URLs or headers going to third parties, no calls straight to finnhub/twelvedata).
4. Repeat at mobile (390x844) and desktop (1440x900) via `browser_resize`; repeat in dark and light theme.
5. Report: what was checked, pass/fail per item, evidence, and any defects found.

## Self-improvement loop (do this every run)
- **On any defect, flake, or wasted step**: append a dated one-liner to LEARNINGS.md under the right heading
  (Gotchas, Faster ways, Review-derived checks).
- **After `self-review` or a code review** produces findings: for each finding a browser check could have
  caught, add a "Review-derived check" so the next run tests for it.
- **Promote**: when a lesson appears twice, or is a step every run needs, fold it into the Procedure above
  and remove the duplicate from LEARNINGS.md.
- **After a phase completes** (see CLAUDE.md): re-validate every LEARNINGS entry against the current stack;
  delete obsolete ones, fold in the rest.
- If a check should be permanent, convert it into an e2e test via the `e2e-testing` skill.
