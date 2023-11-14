const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: String,
  name: String,
  charId: Number,
  death: Boolean,
});

const tableSchema = new mongoose.Schema({
  gameKey: String,
  host: String,
  nights: [{ players: [playerSchema] }],
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
