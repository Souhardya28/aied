export const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => req.body?.[f] === undefined || req.body[f] === '');
  if (missing.length) return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });
  next();
};

export const isYouTubeUrl = (url) =>
  /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/.test(url);
