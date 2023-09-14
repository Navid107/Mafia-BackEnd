const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({ 
  name: { type: String, required: true },
  role: { type: String, required: true },
  side: { type: String, required: true },
  // Add more fields as needed for player attributes and game interactions
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
