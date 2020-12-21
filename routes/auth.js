const express = require('express');

const {
    createUser,
    signin
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup' , createUser);
router.post('/signin', signin);
module.exports = router;