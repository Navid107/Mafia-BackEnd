const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoute')
require('dotenv').config();
const cookieParser = require('cookie-parser'); 

const app = express();
const servers = http.createServer(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());



// Replace <your_mongodb_uri> with your actual MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;
/// Middleware

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

/*
If you have new character to upload into dataBase
go to characters folders and edit
and paste it the whole char.js in this 
area

*/

app.use('/api/auth/refresh', require('./routes/refresh'));
// Use the auth routes middleware
const auth = require("./routes/authRoute");
app.use("/api/auth", auth)


const gameRoutes = require("./routes/gameRoutes/gameRoutes");
app.use("/api/game", gameRoutes);


const PORT = process.env.PORT || 3500;

// Start the server
servers.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
