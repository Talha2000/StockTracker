# StockTracker rehaul plan

Decisions: Twelve Data for candles (Finnhub for quotes/search/profile/news), TypeScript strict with
proper ESLint (typescript-eslint, react-hooks, jsx-a11y), clean modern fintech look (Wealthsimple-like).

Status legend: [ ] todo, [~] in progress, [x] done. Each phase ends with a **phase retro** (see CLAUDE.md):
update all skills and docs.

## Phase 0: Safety (first)
- [ ] Rotate the Finnhub key (it is in git history); add `.env` handling and `.env.example`.
- [ ] Skills and CLAUDE.md in place (done in this commit).

## Phase 1: Foundation
- [ ] Branch `rehaul/foundation`. Scaffold Vite + React 19 + TS strict in `stock-tracker/`.
- [ ] Router 7, Tailwind v4, shadcn/ui, TanStack Query, Recharts, `motion`; remove sass/scss/heroicons v1.
- [ ] ESLint flat config (typescript-eslint strict, react-hooks, jsx-a11y, import order) + Prettier.
- [ ] `npm run lint`, `typecheck`, `test` (Vitest), Playwright set up.
- [ ] Port existing pages 1:1 to TS; retro.

## Phase 2: Data layer + API
- [ ] Convert `API/` to TypeScript (or add types + lint at minimum).
- [ ] `/api/market/{search,quote,profile,news,candles}` proxy with zod validation, caching, rate limiting.
- [ ] Twelve Data candles; client uses one typed service + TanStack Query. Remove all client keys.
- [ ] Pentest pass on new routes; retro.

## Phase 3: Design system
- [ ] Tokens (color, type scale, radius, spacing), light/dark themes, base components.
- [ ] Storybook optional. Accessibility baseline (contrast, focus, reduced motion).

## Phase 4: UX
- [ ] Dashboard: watchlist with sparklines, market overview, skeletons.
- [ ] Stock detail: interactive chart (1D-5Y), key stats, news.
- [ ] Ctrl+K search palette; portfolio allocation and gain/loss.
- [ ] Mobile-first, empty/error states, e2e coverage for every flow; final retro and docs refresh.
