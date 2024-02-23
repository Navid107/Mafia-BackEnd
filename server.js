const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const mongoose = require('mongoose')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const app = express()
const servers = http.createServer(app)
const MONGODB_URI = process.env.MONGODB_URI
//const FRONTEND = process.env.ORIGIN_HOST
const port = process.env.PORT

require('dotenv').config()
app.use(bodyParser.json())

const cors = require('cors')
const corsOption = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOption))
app.use(cookieParser())

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// User Routes
const auth = require('./routes/authRoute')
app.use('/api/auth', auth)

// Cookies Route
const refreshAccessToken = require('./routes/refresh')
app.use('/api/auth/refreshToken', refreshAccessToken)
//Verifying the access token in each request in game routes
app.use(verifyJWT.verifyToken)
// Game Routes
const gameRoutes = require('./routes/gameRoutes/gameRoutes')
app.use('/api/game', gameRoutes)

// Start the server
servers.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
