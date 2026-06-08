import express from 'express';

const router = express.Router();

router.get('/public/prod/public-settings/by-id/:appId', (req, res) => {
  const appId = req.params.appId;
  return res.json({
    id: appId,
    public_settings: {
      auth_required: false,
      app_name: 'SMACom',
      auth_providers: ['email', 'google'],
    },
  });
});

export default router;
