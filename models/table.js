const mongoose = require('mongoose');


const tableSchema = new mongoose.Schema({
  players: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },]
});
const User = mongoose.model('Table', userSchema);

module.exports = User;
