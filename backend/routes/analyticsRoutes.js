const express = require('express');
const Analytics = require('../models/analytics');
const router = express.Router();

router.get('/analytics', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const analytics = await Analytics.find({ userId: req.user.email });
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;