// Vercel serverless entry point. Every request matching vercel.json's
// catch-all rewrite lands here with its original path (e.g. /api/auth/login)
// intact, which is exactly what the Express app's own routes expect — see
// app.use('/api/auth', ...) etc. in ../index.ts.
//
// Requires the COMPILED output (../dist/index.js), not ../index.ts directly:
// Vercel's zero-config TS handling only applies to files inside this api/
// directory, not to files elsewhere in the project that get require()'d —
// vercel.json's buildCommand runs `tsc` first so dist/ exists by deploy time.
module.exports = require('../dist/index.js').default;
