const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
require('dotenv').config()

// Access the secret key using process.env
const secretKey = process.env.ACCESS_TOKEN_SECRET
const secretRfTkn = process.env.REFRESH_TOKEN_SECRET

// Register controller function
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({
      name,
      email,
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

    // Check if the user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Compare the hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Generate a JSON Web Token (JWT) with the userId as the payload
    const accessToken = jwt.sign(
      {
        user: user.name,
        userId: user._id
      },
      secretKey,
      { expiresIn: '30m' }
    )

    const refreshToken = jwt.sign({ userId: user._id }, secretRfTkn, {
      expiresIn: '4h'
    })

    // Respond with a success message and the JWT
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.json({ message: 'Logged in successfully', accessToken })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}
