const jwt = require('jsonwebtoken')
require('dotenv').config()

const accessSecretKey = process.env.ACCESS_TOKEN_SECRET
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET

// Middleware to verify JWT and set authenticated user ID
exports.verifyToken = (req, res, next) => {
  // Bearer token from header or cookie
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing' })
  }
  //Separating the token from the authorization header
  const token = authHeader.split(' ')[1]
  //Verify the token 
  jwt.verify(token, accessSecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token is expired' })
    }
    // Store user information in the request object
    req.userId = decoded.userId
    next()
  })
}

exports.refreshAccessToken = (req, res) => {
  // Retrieve the "jwt" cookie
  const jwtToken = req.cookies.refreshToken
  // Verify that a valid "jwt" cookie exists
  if (!jwtToken) {
    return res.status(401).json({ message: 'JWT token not found' })
  }

  // Verify the JWT token using the refresh token secret key
  jwt.verify(jwtToken, refreshSecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'JWT token is invalid' })
    }
    // You can use the decoded user information here if needed
    const user = decoded

    // Generate a new access token if needed (using the access token secret key)
    const newAccessToken = jwt.sign(user, accessSecretKey)

    // Return the protected resource
    res.json({
      message: 'Authenticated User Profile',
      user,
      accessToken: newAccessToken
    })
  })
}
