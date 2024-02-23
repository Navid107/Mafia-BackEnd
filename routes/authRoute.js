const express = require('express')
const router = express.Router()
const auth = require('../controller/auth.js')

// Route for user registration/Login
router.post('/signup', auth.register)
router.post('/login', auth.login)
router.get('/logout', auth.logout)
module.exports = router
