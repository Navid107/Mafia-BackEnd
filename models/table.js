const mongoose = require('mongoose')

// Players assigning to a character format Schema
const playerSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  char: {
    id: Number,
    name: String,
    side: String,
    ability: Boolean,
    death: Boolean
  }
})
// Players assigned with character Schema
const tableSchema = new mongoose.Schema({
  gameKey: String,
  host: String,
  gameOver: String,
  nights: [{ players: [playerSchema] }]
})

const Table = mongoose.model('Table', tableSchema)

module.exports = Table
