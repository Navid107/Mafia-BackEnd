const mongoose = require('mongoose')

//PreGame Lobby Schema
const gameSchema = new mongoose.Schema({
  gameKey: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lobbyName: String,
  players: Array,
  gameState: String
})

module.exports = mongoose.model('Game', gameSchema)
