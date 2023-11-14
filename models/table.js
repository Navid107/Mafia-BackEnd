const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: String,
  name: String,
  charID: String,
  death: Boolean,
});

const tableSchema = new mongoose.Schema({
  gameKey: String,
  host: String,
  nights: [{ night: Number, players: [playerSchema] }],
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
