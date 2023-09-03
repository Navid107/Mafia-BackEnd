// models/player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Mafia', 'Townsperson'], required: true },
  isAlive: { type: Boolean, default: true },
  // Add more fields as needed for player attributes and game interactions
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
