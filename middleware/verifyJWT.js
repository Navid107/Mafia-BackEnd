const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.ACCESS_TOKEN_SECRET

// Middleware to verify JWT and set authenticated user ID
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(403).json({ message: 'Token is missing' })
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' })
    }
    // Store user information in the request object
    req.userId = decoded.id 
    next()
  })
}

module.exports = {
  verifyToken
}
