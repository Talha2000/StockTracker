# StockTracker

Monorepo: `stock-tracker/` (React client, deployed on Vercel) and `API/` (Express backend, deployed on
Render), with Postgres on Neon as the database, accessed via Prisma (`API/prisma/schema.prisma`).
The rehaul plan and current phase status live in [docs/REHAUL_PLAN.md](docs/REHAUL_PLAN.md).

## Target stack (rehaul)
Vite, React 19, TypeScript (strict), React Router 7, Tailwind v4, shadcn/ui (Radix), TanStack Query,
Recharts, `motion` (add in Phase 4 when animating). Market data goes through the Express API only: Finnhub for quotes/search/profile/news,
Twelve Data for historical candles. **API keys never ship in the client bundle.**

## Commands
Client (run in `stock-tracker/`): `npm run dev` (port 3000, proxies `/api` to `localhost:5001`),
`npm run lint`, `npm run typecheck`, `npm test` (Vitest), `npm run test:e2e` (Playwright, all API mocked),
`npm run build`.
API (run in `API/`): `npm run devStart`. `npm run db:migrate` after any `schema.prisma` change (creates +
applies a migration locally); `npm run db:studio` to browse data; `npm start` runs `prisma migrate deploy`
before booting, so production applies pending migrations automatically on deploy.
Secrets live in the repo-root `.env` (gitignored; see `.env.example`): `FINNHUB_KEY`, `TWELVEDATA_KEY`,
`DATABASE_URL` (Neon pooled), `DATABASE_URL_UNPOOLED` (Neon direct — same host, no `-pooler`; Prisma
Migrate needs this one), `ACCESS_TOKEN` (JWT secret — any local value works for dev, Render has the real one).

## Structure and conventions
- `src/lib` (api client + zod schemas, formatters), `src/hooks` (TanStack Query), `src/context`
  (`*.ts` = context + hook, `*Provider.tsx` = component; split for react-refresh), `src/components`, `src/pages`.
- Import via `@/` alias. Validate every API response with zod in `lib/api.ts`; no `any`.
- Theme = `dark` class on `<html>`; style with Tailwind `dark:` variants, never JS ternaries on theme.
- **TypeScript is pinned to ~6**: typescript-eslint does not support TS 7 yet. Revisit when it does.
- Do not `rm -rf` in this repo from the agent shell (blocked); use `git rm` for tracked files.
- API data model: `API/prisma/schema.prisma` (Postgres on Neon). `User` and `Watchlist` (one row per
  user+symbol bookmark, proper FK with cascade delete — replaces the old Mongo collection that had none).
  Controllers use the Prisma client exported from `API/db.js`; there is no more Mongoose/Mongo anywhere.
  Stay on Prisma 6.x (`prisma-client-js` generator) until the API itself is converted to TypeScript —
  Prisma 7's default generator emits TypeScript-only output with no plain-JS build, which a CommonJS API
  can't consume without adding a compile step.

## Design direction
Clean, modern fintech in the style of Wealthsimple: generous whitespace, calm neutral palette with a single
accent, large confident typography, soft radii, subtle motion, green/red reserved for price movement,
dark and light themes, mobile-first. Use the `frontend-design` skill for UI work.

## Project skills (in `.claude/skills/`)
- `e2e-testing`: Playwright test suite authoring and running.
- `browser-verify`: drive the real app with Playwright to confirm a change works; self-improving.
- `self-review`: review your own diff before declaring work done; feeds lessons into other skills.
- `pentest`: authorized, local-only security testing of this app.

## Definition of done (every change)
1. `npm run lint` and `npm run typecheck` pass (client and API).
2. Unit/e2e tests relevant to the change pass.
3. `browser-verify` run for any UI change.
4. `self-review` run on the diff; findings fixed or explicitly noted.

## Self-updating instructions (mandatory)
Skills and this file are living documents. Update them, in the same PR as the work, when:
- **A big finding occurs**: a bug class, security issue, flaky-test cause, or tooling gotcha that could recur.
  Add a dated one-line lesson to the relevant skill's `LEARNINGS.md` and, if it changes the procedure,
  edit that skill's `SKILL.md`.
- **A phase completes**: before closing a phase in `docs/REHAUL_PLAN.md`, do a "phase retro":
  1. Re-read every skill and this file; correct anything now stale (commands, paths, stack, conventions).
  2. Promote repeated lessons from `LEARNINGS.md` into `SKILL.md` steps or checklists; prune duplicates.
  3. Update the stack, structure and commands sections here and the phase status in the plan.
- **Documentation drift**: if you notice a doc, README or skill contradicting the code, fix it immediately.

Never delete a lesson without folding it into a rule. Keep entries short and dated (YYYY-MM-DD).
