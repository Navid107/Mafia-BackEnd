const express = require('express');
const router = express.Router();
const auth = require('../controller/auth.js');

// Route for user registration
router.post('/signup', auth.register);

// Route for user login
router.post('/login', auth.login);

router.get('/user',  auth.user);

module.exports = router;
