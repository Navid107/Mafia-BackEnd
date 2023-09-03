// models/game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  isStarted: { type: Boolean, default: false },
  // Add more fields as needed to represent game state and settings
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
