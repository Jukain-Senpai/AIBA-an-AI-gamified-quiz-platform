const express = require('express');
const router = express.Router();

// Simple echo endpoint to inspect received JSON payloads
router.post('/echo', (req, res) => {
  console.log('[DEBUG] /api/debug/echo received:', req.body);
  res.json({ received: req.body });
});

module.exports = router;
