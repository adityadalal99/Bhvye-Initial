const express = require('express');
const { protect } = require('../middleware/auth');
const {getUserProfile} = require('../controllers/profile');
const router = express.Router();

router.route('/:username').get(protect, getUserProfile);

module.exports = router;