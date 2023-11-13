const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    players:[],
})

const tableSchema = new mongoose.Schema({
    gameKey: String,
    host: String,
    nights: [playerSchema],
});
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
