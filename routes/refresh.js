const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tokenCTR = require('../controller/refreshToken')
const secretKey = process.env.ACCESS_TOKEN_SECRET;

// Route for token refresh
router.get('/',tokenCTR.refreshToken)

  
module.exports = router;

