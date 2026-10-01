// Vercel serverless entry point. Every request matching vercel.json's
// catch-all rewrite lands here with its original path (e.g. /api/auth/login)
// intact, which is exactly what the Express app's own routes expect — see
// app.use('/api/auth', ...) etc. in ../index.js.
module.exports = require('../index.js');
