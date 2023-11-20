const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  gameOver: Boolean,
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
  nights: [{ players: [playerSchema] }],
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
