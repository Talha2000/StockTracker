# self-review learnings

- 2026-09-23: Finnhub API key was hardcoded in two client files and committed. Never put provider keys in
  client code; proxy through the API. (Key must be rotated: it was public on GitHub.)
- 2026-09-23: Finnhub `/stock/candle` is paid-tier; do not build features on it.
- 2026-09-24: Bug class "wrong field displayed": old Overview showed previous close (`pc`) as the price.
  Re-check field mapping whenever porting or touching quote/profile displays.
- 2026-09-24: React 19 deprecates `FormEvent` (use `SubmitEvent`); strictTypeChecked lint catches this.
- 2026-09-24: Tooling: `typescript-eslint` rejects TypeScript 7, so keep `typescript@~6`. `@testing-library/dom`
  is a required peer of jest-dom/react; install it explicitly.
- 2026-09-24: Old `auth` re-validated the token against `/users/me` before every request; replaced by a single
  axios interceptor + 401 handler. Avoid per-call auth round trips.
- 2026-09-24: Old API `errorHandler` is registered before the routes so it never runs (Phase 2 fix).
- 2026-09-30: `npm install` with an existing lockfile/node_modules can silently tolerate a peer-dependency
  conflict that a fresh `npm ci` (what Vercel/CI runs) rejects with ERESOLVE. Verified this way: installed
  `eslint@^10` but `eslint-plugin-jsx-a11y@6.10.2` only supports `eslint` up to `^9` (no newer release
  exists) — passed locally, failed on Vercel. Before shipping a dependency bump, run `rm -rf node_modules &&
  npm ci` (not just `npm install`) to catch this, or check `npm view <pkg> peerDependencies` for every
  eslint plugin against the eslint major you're pinning.
- 2026-09-30: Rewriting git history locally (e.g. `git-filter-repo`) severs the shared ancestor with the
  unrewritten remote, even for commits that never touched the affected file (parent hash changes cascade).
  A later `git pull`/rebase against the remote will then replay the entire original history and conflict on
  almost everything. If you must redact a committed secret without force-pushing, don't rewrite history at
  all — just rotate the secret and add a normal commit removing it from current files; keep the history
  rewrite option only for when you're prepared to force-push.
