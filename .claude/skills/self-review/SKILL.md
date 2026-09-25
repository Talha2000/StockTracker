---
name: self-review
description: Review your own diff for bugs, security problems, type/lint issues, UX regressions and missing tests before declaring work done, then feed lessons back into the other project skills. Use at the end of every change and before commits or PRs.
---

# self-review

## Procedure
1. Get the diff (`git diff` plus staged and untracked files). Read every changed line as a reviewer would.
2. Run `npm run lint`, `npm run typecheck`, and relevant tests in each touched package. Failures block "done".
3. Checklist:
   - **Correctness**: edge cases (empty, null, market closed, API 429/500, stale data), race conditions in
     effects/queries, unhandled promise rejections, timezone/number formatting of prices.
   - **Security**: no secrets or keys in client code or git; inputs validated server-side; auth on every
     private route; no `dangerouslySetInnerHTML` with API data (news!); CORS and cookie flags sane.
   - **TypeScript**: no `any`, no unchecked casts; API responses parsed with a schema (zod) at the boundary.
   - **UX**: loading, empty, error states; keyboard and screen-reader access; mobile layout; both themes.
   - **Quality**: duplicated logic, dead code, leftover `console.log`, missing tests for new behavior.
4. For UI changes, run `browser-verify`. For auth/API changes, run the relevant `pentest` checks.
5. Fix findings; list any deliberately deferred with a reason.

## Learning loop (required)
After each review, for every real finding:
- Add a dated one-liner to [LEARNINGS.md](LEARNINGS.md).
- Route the lesson onward: a check a browser could catch goes to `browser-verify/LEARNINGS.md`
  (Review-derived checks); a regression worth locking in goes to an e2e test; a vulnerability class goes to
  `pentest/LEARNINGS.md`. If the same class of finding appears twice, add it to the checklist above.
At phase end (see CLAUDE.md), rewrite the checklist so it reflects the current stack and the most common
real findings, and prune stale items.
