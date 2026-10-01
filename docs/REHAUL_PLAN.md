# StockTracker rehaul plan

Decisions: Twelve Data for candles (Finnhub for quotes/search/profile/news), TypeScript strict with
proper ESLint (typescript-eslint, react-hooks, jsx-a11y, import order), clean modern fintech look
(Wealthsimple-like). Database: Postgres on Neon via Prisma (migrated off MongoDB/Atlas — relational data,
and the user's other projects already standardize on Neon).

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

### Phase 2a: Database — MongoDB → Neon Postgres + Prisma [x] (branch `phase2/neon-prisma`)
- [x] Neon project created (owner); `DATABASE_URL` (pooled) + `DATABASE_URL_UNPOOLED` (direct, for
      Prisma Migrate) + `ACCESS_TOKEN` added to the repo-root `.env`.
- [x] `API/prisma/schema.prisma`: `User` and `Watchlist` (replaces the old `UserStock` collection, which
      stored the user id as a loose string with no real foreign key — `Watchlist.userId` is now a proper
      FK to `User.id` with cascade delete, plus a `@@unique([userId, stockSymbol])`).
- [x] `prisma.config.ts` added (loads the repo-root `.env`, since Prisma's CLI only auto-loads one next to
      `schema.prisma`). Prisma pinned to 6.x — see the CLAUDE.md note on why (v7's generator needs TS).
- [x] `authController`, `userController`, `stockController` rewritten against the Prisma client
      (`API/db.js`); Mongoose/Mongo removed entirely (`mongoose`, `mongodb` deps and `API/models/` gone).
- [x] Bugs fixed along the way: `userController.getMe` destructured `req.user.id` (a string) instead of
      `req.user`, so `/api/users/me` always returned `undefined` fields; `errorHandler` was registered
      before the routes so it never ran; several handlers did `.json("msg", err)` (the second argument to
      `.json()` is silently dropped) instead of returning the error in the body.
- [x] `npm run db:migrate` / `db:deploy` / `db:studio` scripts; `postinstall: prisma generate` so a fresh
      `npm install` (Render) always has a client; `start` now runs `prisma migrate deploy` before booting.
- [x] Verified end-to-end against the real Neon database: register, login, `/me`, save (idempotent via
      upsert), list, remove — all exercised with curl, not just read.
- [x] ~~Owner action re: Render~~ — moot, API moved off Render entirely (see 2a.1).
- [ ] Nice-to-have, not done: a separate Neon branch for local/dev vs. the production branch, so local
      testing can't touch prod data. One Neon project/branch is in use for both right now.

### Phase 2a.1: Hosting — Render → Vercel serverless [x] (same branch)
- [x] `API/index.js` now exports the Express `app`; `app.listen()`/`connectDB()` only run when the file is
      executed directly (`require.main === module`), not when imported as a request handler.
- [x] `API/api/index.js` (Vercel's serverless entry point) + `API/vercel.json` (catch-all rewrite to it).
- [x] Removed the client's hardcoded Render URL fallback (`lib/api.ts`); production now requires
      `VITE_API_URL` and throws clearly at runtime if it's missing, instead of silently calling the
      wrong host.
- [x] Verified locally by serving the exported app through a plain `http.createServer` (how Vercel's Node
      runtime invokes a serverless function) and hitting a real route end-to-end.
- [x] `schema.prisma`'s `directUrl` removed (owner chose not to set `DATABASE_URL_UNPOOLED` on Vercel for
      now): Prisma Migrate runs over the pooled connection too. Verified `prisma migrate deploy` actually
      works that way against this Neon project before relying on it. `buildCommand` removed from
      `vercel.json` — migrations are applied by running `npm run db:migrate`/`db:deploy` locally, not
      automatically on Vercel's build. Revisit (add `directUrl` + the env var back) if that ever breaks.
- [x] Owner created the Vercel project (`stock-tracker`, Root Directory = `API`) and added `DATABASE_URL` +
      `FINNHUB_KEY`. Linked and deployed from here via the Vercel CLI (already authenticated on this
      machine). Live at **https://stock-tracker-lake-tau.vercel.app**.
- [x] **Incident found and fixed during that first deploy** — full writeup in
      `.claude/skills/pentest/LEARNINGS.md` (2026-10-01). Summary: `vercel deploy` ignores `.gitignore`
      and has its own inclusion rules, so the repo-root `.env` (real `DATABASE_URL` + `FINNHUB_KEY`) got
      uploaded into the bundle and read by the running function; separately, with no `public/` directory,
      Vercel's zero-config static fallback served the *entire* source tree — including `.env` itself —
      over plain HTTP on the public production URL. Fixed with `.vercelignore` (root + `API/`) and an
      empty `API/public/`; redeployed and **verified** the leak was actually gone (not just the route
      404ing) by confirming the behavior that depended on the leaked secret changed.
      **Owner action: rotate the Neon DB password and the Finnhub key** — both were briefly served
      publicly in plaintext. Low realistic risk (new, unshared URL, ~2 minute window) but real exposure of
      live credentials, not placeholders. [x] Done — owner rotated both, verified working, synced to
      Vercel (`vercel env rm` + `add`), redeployed, confirmed live with the new DB password.
- [x] `ACCESS_TOKEN` generated (`openssl rand -hex 32`), added to the API's Vercel env vars
      (Production + Preview) and redeployed; login confirmed working end-to-end in production.
- [x] `VITE_API_URL=https://stock-tracker-lake-tau.vercel.app/api` added to the **client's** Vercel
      project (`stock-tracker-dz4a`, Production + Preview as a `config` var, not `secret` — it's a public
      URL, not sensitive) and redeployed; confirmed the built JS bundle at
      https://mystocktracker.vercel.app actually calls the new API URL, not just that the var was set.
- [ ] **Owner action remaining:** decommission the Render service now that the Vercel API is confirmed
      working end-to-end (register, login, watchlist, all exercised live). CORS is still wide open
      (`Access-Control-Allow-Origin: *`, Phase 2b) — fine for now, but tighten before this matters.
- Note: the repo-root `.vercel/` link (local-only, gitignored) gets pointed at whichever Vercel project
  you're deploying — `stock-tracker` for the API, `stock-tracker-dz4a` for the client. Check which one is
  linked (`cat .vercel/project.json`, if present) before running `vercel deploy` from the repo root.

### Phase 2b: API hardening — remaining
- [ ] Convert `API/` to TypeScript (or add types + lint at minimum) — also unlocks Prisma 7.
- [ ] Harden `/api/market/*`: zod-validate upstream, caching, rate limiting, helmet, CORS allowlist.
- [ ] Twelve Data for candles (Finnhub `/stock/candle` is paid) behind `/api/market/candles`.
- [ ] Remaining known issues: CORS is `*`; auth token lives in `sessionStorage` (evaluate httpOnly cookie).
- [ ] Pentest pass on new routes; retro.

## Phase 3: Design system
- [ ] Tokens (color, type scale, radius, spacing), light/dark themes, base components (shadcn/ui).
- [ ] Web font, Storybook optional. Accessibility baseline (contrast, focus, reduced motion).

## Phase 4: UX
- [ ] Dashboard: watchlist with sparklines, market overview, skeletons.
- [ ] Stock detail: interactive chart (1D-5Y), key stats, news.
- [ ] Ctrl+K search palette (debounced); portfolio allocation and gain/loss.
- [ ] Mobile-first, empty/error states, e2e coverage for every flow; final retro and docs refresh.
