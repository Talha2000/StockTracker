const errorHandler = (err, req, res, next) => {
    // res.statusCode defaults to 200 before anything sets it, so the old
    // `res.statusCode ? res.statusCode : 500` always picked 200 (truthy) —
    // every error handled here came back with a 200 status. Prefer a status
    // explicitly attached to the error (err.statusCode), then only trust
    // res.statusCode if a route already changed it from the default, and
    // fall back to 500.
    const statusCode = err.statusCode || err.status || (res.statusCode !== 200 ? res.statusCode : 500);

    res.status(statusCode)

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {
    errorHandler,
}
