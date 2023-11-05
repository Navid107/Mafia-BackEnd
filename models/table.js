const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    gameKey: String,
    host: String,
    players: Array,
    
});
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
