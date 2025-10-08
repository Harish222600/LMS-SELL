const express = require('express');
const router = express.Router();

const { fixExistingDurations, checkDurationStatus } = require('../controllers/fixDurations');
const { auth } = require('../middleware/auth');


// Temporary routes to fix duration issues
router.post('/fix-durations', auth, fixExistingDurations);
router.get('/check-durations', auth, checkDurationStatus);

module.exports = router;
