export function notFound(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong on the server.' });
}
