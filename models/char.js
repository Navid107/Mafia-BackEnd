const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  side: String,
  ability: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;