# StockTracker rehaul plan

Decisions: Twelve Data for candles (Finnhub for quotes/search/profile/news), TypeScript strict with
proper ESLint (typescript-eslint, react-hooks, jsx-a11y, import order), clean modern fintech look
(Wealthsimple-like).

Status legend: [ ] todo, [~] in progress, [x] done. Each phase ends with a **phase retro** (see CLAUDE.md):
update all skills and docs.

## Phase 0: Safety [x]
- [x] Finnhub key redacted from all git history (incl. `gh-pages`) with git-filter-repo; local only.
- [x] No provider key in any source; API reads `FINNHUB_KEY` from root `.env`; `.env.example` added.
- [x] Skills and CLAUDE.md in place.
- [ ] **Owner actions:** force-push rewritten history (`main`, `gh-pages`), rotate the Finnhub key
      (it was public on GitHub), re-deploy `gh-pages` (old bundle held the key), save the key to `.env`.

## Phase 1: Foundation [x] (branch `rehaul/foundation`)
- [x] Vite 8 + React 19 + TypeScript strict (TS pinned ~6 for typescript-eslint), Router 7, Tailwind v4,
      TanStack Query, Recharts 3, lucide-react, zod. Removed CRA, sass/scss, heroicons v1.
- [x] ESLint flat config (strictTypeChecked, react-hooks, jsx-a11y, import order) + Prettier; 0 errors.
- [x] Vitest (unit) + Playwright (e2e, mocked API; desktop + mobile) wired up and passing.
- [x] All pages/components ported to TS; theme via `dark` class; charts lazy-loaded.
- [x] Minimal `/api/market/*` proxy (moved forward from Phase 2 so no key ships to the client).
- Deferred to Phase 3: shadcn/ui primitives (design system lives there).
- [x] Retro done.

## Phase 2: Data layer + API
- [ ] Convert `API/` to TypeScript (or add types + lint at minimum).
- [ ] Harden `/api/market/*`: zod-validate upstream, caching, rate limiting, helmet, CORS allowlist.
- [ ] Twelve Data for candles (Finnhub `/stock/candle` is paid) behind `/api/market/candles`.
- [ ] Known API issues to fix: `errorHandler` is registered before routes (never runs); CORS is `*`;
      errors returned as bare strings; `.json("msg", err)` misuse; token in `sessionStorage`
      (evaluate httpOnly cookie).
- [ ] Pentest pass on new routes; retro.

## Phase 3: Design system
- [ ] Tokens (color, type scale, radius, spacing), light/dark themes, base components (shadcn/ui).
- [ ] Web font, Storybook optional. Accessibility baseline (contrast, focus, reduced motion).

## Phase 4: UX
- [ ] Dashboard: watchlist with sparklines, market overview, skeletons.
- [ ] Stock detail: interactive chart (1D-5Y), key stats, news.
- [ ] Ctrl+K search palette (debounced); portfolio allocation and gain/loss.
- [ ] Mobile-first, empty/error states, e2e coverage for every flow; final retro and docs refresh.
