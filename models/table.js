const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    gameKey: String,
    host: String,
    players: {
        userID: String,
        name: String,
        char: {}
        
    },
});
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
