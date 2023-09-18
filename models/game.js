const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameKey: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lobbyName: String,
  players: [ {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
  },],
  // Add other game properties as needed
});

module.exports = mongoose.model('Game', gameSchema);
