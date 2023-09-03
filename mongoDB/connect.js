// app.js
const mongoose = require('mongoose');


const MONGODB_URI = 'mongodb+srv://mafia8:!17Alex!17@cluster0.nsgf9xi.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
