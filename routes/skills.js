const express = require('express');
const {protect} = require('../middleware/auth');
const {getBasicInfo} = require('../controllers/skills');

const router = express.Router();

router.route('/').post(protect,getBasicInfo);

module.exports = router;