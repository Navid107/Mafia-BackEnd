const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoute')
require('dotenv').config();
const cookieParser = require('cookie-parser'); 


const app = express();
const servers = http.createServer(app);

app.use(bodyParser.json());
app.use(cookieParser()); ;

const io = socketio(servers, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle the "join" event when a player joins the game
  socket.on("join", (playerId) => {
    console.log(`Player with ID ${playerId} joined the game`);

    // Broadcast the "join" event to all other connected clients
    socket.broadcast.emit("playerJoined", playerId);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Replace <your_mongodb_uri> with your actual MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

/// Middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle MongoDB connection events
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
app.use('/refresh', require('./routes/refresh'));
// Use the auth routes middleware
const auth = require("./controller/auth.js");
app.use("/api/auth/register", auth.register);
app.use("/api/auth/login", auth.login);
app.use("/api/auth/user", auth.user);


const gameRoutes = require("./routes/gameRoutes/gameRoutes");
app.use("/api", gameRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3500;

// Start the server
servers.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
