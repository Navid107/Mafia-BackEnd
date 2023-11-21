const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  char: {
    id: Number,
    name: String,
    side: String,
    ability: Boolean,
    death: Boolean,
  }
});

const tableSchema = new mongoose.Schema({
  gameKey: String,
  host: String,
  gameOver: String,
  nights: [{ players: [playerSchema] }],
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
