# StockTracker client

React 19 + TypeScript + Vite + Tailwind v4. See the repo-root `CLAUDE.md` for conventions and
`docs/REHAUL_PLAN.md` for the roadmap.

```bash
npm install
npm run dev        # http://localhost:3000, proxies /api to http://localhost:5001
npm run lint && npm run typecheck && npm test
npm run test:e2e   # Playwright; the API is mocked
npm run build
```

Market data is served by the Express API in `../API`, which holds the provider keys. Put them in the
repo-root `.env` (see `.env.example`). Set `VITE_API_URL` to point a production build at another API.
