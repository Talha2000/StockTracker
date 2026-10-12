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

### Phase 2b: API hardening [x]
- [x] Registration simplified: username/password/confirm-password only, `User.email` dropped from the
      schema entirely (migration applied — table was empty, no data loss). Server still validates
      username length and password length independent of the client.
- [x] CORS locked to an allowlist (`ALLOWED_ORIGINS` env, else localhost:3000 + the prod client URL).
      Found and fixed two real bugs while doing this, not just "add an allowlist" — full writeup in
      `.claude/skills/pentest/LEARNINGS.md` (2026-10-11): a manual header middleware was silently
      overriding `cors()`'s allowlist every time (so it was previously inert regardless of config), and
      `errorHandler.js` always returned HTTP 200 for every error due to a truthy-default bug.
      Verified live: allowed origin → 200, disallowed → 403 with no stack leak, preflight (OPTIONS)
      works for the real client origin.
- [x] Twelve Data wired up for `/api/market/candles` (Finnhub's own candle endpoint is paid-tier).
      Response reshaped to the same `{ s, c, t }` shape Finnhub used, so the client's `candlesSchema` and
      `useCandles` hook needed zero changes. Verified against the real Twelve Data API (not just the
      client mocks): both chart resolutions (15min/1h), an invalid symbol (graceful `no_data`, not a
      500), and an invalid resolution (400).
- [x] Every `/api/market/*` route now has a short in-memory cache (20s quotes, 5min search/news/candles,
      1h company profiles — tuned to how often each actually changes) and a rate limit (60 req/min/IP).
      Caveat noted in code: serverless means the cache only lives as long as one warm function instance,
      it's not shared/durable — still cuts duplicate calls in a burst for free, no extra infra.
- [x] `helmet` added, with `crossOriginResourcePolicy: 'cross-origin'` and CSP disabled explicitly (the
      defaults are meant for an HTML-serving app and would have silently broken the client's cross-origin
      fetches). Verified live with the real cross-origin client request.
- [x] `TWELVEDATA_KEY` added to the API's Vercel env vars (Production + Preview) and redeployed.
- [x] `API/` converted to TypeScript: `tsc` build (`dist/`, gitignored), same `strictTypeChecked` ESLint
      rigor as the client, `@types/express` pinned to v4 to match the actual installed Express major (v5
      types were pulled in by default and don't match v4's runtime shape). Found and fixed a real bug
      along the way: the repo-root `.env` loader used a `__dirname`-relative path that broke once compiled
      output moved one directory deeper into `dist/` — fixed by trying both candidate paths (dotenv
      silently no-ops on a missing one). `vercel.json`'s `buildCommand` now runs `npm run build`; `api/
      index.js` (still plain JS — Vercel's zero-config TS handling only covers files inside `api/` itself)
      requires the compiled `dist/index.js`.
- [x] Auth moved from a client-held token (`sessionStorage`, readable by any XSS) to an httpOnly cookie:
      login sets it (`API/lib/authCookie.ts`; flags differ by environment — `SameSite=None; Secure` in
      prod since client/API are different registrable domains, `Lax`/non-secure locally), `protect` reads
      `req.cookies` instead of an `Authorization` header, CORS got `credentials: true` to match. The client
      can't read an httpOnly cookie, so `AuthProvider` now determines `isAuthenticated` by calling
      `GET /users/me` on mount (new `isLoading` on `AuthContextValue`; `RequireAuth`/`Login` wait for it).
      **Real bug found and fixed, not just refactored**: that mount-time `/me` call's 401 for a logged-out
      visitor shared the same global handler as a mid-session token expiry, so it force-navigated *every*
      page (including `/register` itself) to `/login`. The mocked e2e suite didn't catch it — caught by
      running the actual flow in a real browser against the real local API, cross-origin by port
      (`localhost:3000` → `localhost:5001`), and watching it fail; fixed with a `skipAuthRedirect` request
      flag (`src/lib/api.ts`) and added both a real-browser verification and a mocked regression test
      (`visiting /register while logged out stays on /register`) that would have caught it.
      Also added, since the TS conversion made it natural: zod validation of the *upstream* Finnhub/Twelve
      Data response shapes (`API/lib/upstreamSchemas.ts`) — previously only our own outgoing query params
      were validated, never what came back.
- [x] **Pentest pass** — a background security review of the auth-cookie-migration commit caught 3 real
      findings, fixed same-day (full detail in `.claude/skills/pentest/LEARNINGS.md`, 2026-10-11):
      1. CSRF: `SameSite=None` means the auth cookie rides along on a cross-*site* request regardless of
         CORS (CORS only gates whether cross-origin JS can read the *response*). Added
         `API/Middleware/csrf.ts`: every state-changing route now requires a custom `X-Requested-With`
         header, which a bare cross-site form/image attack can't set.
      2. Info disclosure: `authController`/`stockController` error responses included `err.message` —
         could leak DB/driver internals. Now logged server-side only, generic message to the client.
      3. Username enumeration: `login` used to return a different status for "no such user" vs "wrong
         password". Unified to the same 401 for both. (Client fallout: its error-mapping and the
         `skipAuthRedirect` flag both had to account for login itself now using 401, the same status the
         global "session expired" handler watches for.)
      Re-verified the full flow after: mocked suite, and two real-browser passes (local cross-origin,
      production cross-site) covering register → wrong password → correct login → watchlist → logout.
- [x] Retro done — this file and `CLAUDE.md` updated; skills' `LEARNINGS.md`/`SKILL.md` updated inline as
      each finding landed rather than batched at the end.
- [x] Both Vercel projects deployed with everything in this phase and verified live (not just locally):
      TS build succeeded on Vercel, cookie auth works cross-site in production
      (`SameSite=None; Secure`, confirmed via real browser automation against
      https://mystocktracker.vercel.app ↔ https://stock-tracker-lake-tau.vercel.app), Twelve Data candles
      still correct, source still not exposed.

**Phase 2 is done.**

## Phase 3: Design system [x] (branch `phase3/design-system`)
- [x] Tokens in `src/index.css` (semantic colors swapped under `.dark`, radius by hierarchy, display type
      sizes). First pass was ultramarine + marigold; after review the owner asked for a black/white,
      Wealthsimple-like base and picked black + marigold from five rendered options (2026-10-11). The block
      inverts with the theme; marigold is the one accent. Green/red only for price movement.
      All text pairs checked for WCAG AA (price colors darkened to pass on the page background).
- [x] Base components, shadcn-style in `src/components/ui` (Button, Input, Label, Skeleton, ToggleGroup on
      Radix) + `components.json` for the shadcn CLI. Only what the app uses; Dialog etc. come with Phase 4.
- [x] Web font: Schibsted Grotesk Variable, self-hosted (`@fontsource-variable`, ~67 KB woff2).
- [x] Every screen moved onto the system, full width (no centered column): stock pages get a sticky
      "Your list" rail (strip on mobile), then the block (ticker, price, change chip, day range,
      edge-to-edge axis-free chart), then News (compact two-column list, small thumbnails) with Key facts
      beside it; search moved into the nav; auth pages are a full-bleed split; Portfolio renamed Watchlist
      (it was one), compact rows, with `/portfolio` redirecting. A third pass condensed everything after
      owner feedback (smaller type and images, tighter spacing).
      Removed the BUY/SELL buttons, which did nothing. Old `Card`, `.btn-action`, `.field` styles deleted.
- [x] Accessibility baseline: visible `:focus-visible` rings (marigold on ultramarine), reduced motion
      (global CSS + Recharts), labelled controls, `role="status"` on loading states, sentence-case copy.
- [x] Storybook skipped on purpose: overhead without payoff at this size; browser-verify covers it.
- [x] Verified: lint, typecheck, unit (7), e2e (14, incl. new watchlist/redirect test), build; browser-verify
      at 1440 and 390 in both themes; self-review findings fixed (unchecked tooltip cast, wrong-state flash).
- [x] Retro done: stale skill entries fixed (Render/Mongo/`npm start`), lessons logged, CLAUDE.md design
      section rewritten to describe the real system.

## Phase 4: UX
- [ ] Dashboard: watchlist with sparklines, market overview, skeletons.
- [ ] Stock detail: interactive chart (1D-5Y), key stats, news.
- [ ] Ctrl+K search palette (debounced); portfolio allocation and gain/loss.
- [ ] Mobile-first, empty/error states, e2e coverage for every flow; final retro and docs refresh.
