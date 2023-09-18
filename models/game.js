const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameKey: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lobbyName: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  // Add other game properties as needed
});

module.exports = mongoose.model('Game', gameSchema);
