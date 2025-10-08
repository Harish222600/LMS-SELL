const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { getSystemHealth } = require('../controllers/systemHealth');

// Get system health metrics (admin only)
router.get('/metrics', auth, isAdmin, getSystemHealth);

module.exports = router;
