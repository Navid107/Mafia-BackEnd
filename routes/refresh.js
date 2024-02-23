const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT')

// Route for token refresh
router.get('/',verifyJWT.refreshAccessToken)

  
module.exports = router;

