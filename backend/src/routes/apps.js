import express from 'express';

const router = express.Router();

// Simple in-memory cache for public settings to avoid recomputing
const settingsCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

router.get('/public/prod/public-settings/by-id/:appId', (req, res) => {
  const appId = req.params.appId;
  const cacheKey = `public_settings:${appId}`;
  const entry = settingsCache.get(cacheKey);
  if (entry && Date.now() - entry.ts < CACHE_TTL_MS) {
    res.set('X-Cache', 'HIT');
    return res.json(entry.value);
  }

  const payload = {
    id: appId,
    public_settings: {
      auth_required: false,
      app_name: 'SMACom',
      auth_providers: ['email', 'google'],
    },
  };

  settingsCache.set(cacheKey, { ts: Date.now(), value: payload });
  res.set('X-Cache', 'MISS');
  return res.json(payload);
});

export default router;
