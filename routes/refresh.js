const express = require('express');
const router = express.Router();
const tokenCTR = require('../controller/refreshToken')

// Route for token refresh
router.get('/refresh',tokenCTR.refreshToken)

  
module.exports = router;

