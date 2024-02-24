const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const ExpireToken = require('../models/expiredToken.js')
require('dotenv').config()

// Access the secret key using process.env
const secretKey = process.env.ACCESS_TOKEN_SECRET
const secretRfTkn = process.env.REFRESH_TOKEN_SECRET

// Register controller function
exports.register = async (req, res) => {
  const { name, email, password } = req.body
  //Turning every letter into lower case
  const lowerCaseEmail = email.toLowerCase()
  // Check if the user already exists
  const existingUser = await User.findOne({ email: lowerCaseEmail })
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' })
  }

  try {
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, 10)

    // Store a new user
    const newUser = new User({
      name,
      email: lowerCaseEmail,
      password: hashedPassword
    })

    // Save the new user to the database
    await newUser.save()

    // Respond with a success message
    res.json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
    console.log(error)
  }
}

// Login controller function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    //Turning every letter into lower case
    const lowerCaseEmail = email.toLowerCase()

    // Check if the user exists
    const user = await User.findOne({ email: lowerCaseEmail })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Compare the hashed passwords
    const match = await bcrypt.compare(password, user.password)

    if (match) {
      // Generate a JSON Web Token (JWT) with the userId as the payload
      const accessToken = jwt.sign(
        {
          user: user.name,
          userId: user._id
        },
        secretKey,
        { expiresIn: '2h' }
      )
      const refreshToken = jwt.sign({ userId: user._id }, secretRfTkn, {
        expiresIn: '4h'
      })
      // Respond with a success message and the JWT
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      })
      res.json({ accessToken })
    } else {
      res.status(401).json({ error: 'Invalid password' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

exports.logout = async (req, res) => {
  try {
    // get the session cookie from request header
    const authHeader = req.headers['cookie']
    if (!authHeader) return res.sendStatus(204) // No content
    // If there is, split the cookie string to get the actual jwt token
    const cookie = authHeader.split('=')[1]
    const accessToken = cookie.split(';')[0]
    const checkIfTokenExpired = await ExpireToken.findOne({
      token: accessToken
    }) // Check if that token is ExpireToken listed
    // if true, send a no content response.
    if (checkIfTokenExpired) return res.sendStatus(204)
    // otherwise blacklist token
    const newExpireToken = new ExpireToken({
      token: accessToken
    })
    await newExpireToken.save()
    // Also clear request cookie on client
    res.setHeader('Clear-Site-Data', '"cookies"')
    res.status(200).json({ message: 'You are logged out!' })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    })
  }
  res.end()
}
