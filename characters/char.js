const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: String,
  side: String,
  ability: String,
  image: {
    data: Buffer,
    contentType: String
  }
});

const Character = mongoose.model('Character', characterSchema);

// Read the image files
let characters = [
  {
    name: 'The GodFather',
    side: 'mafia',
    ability: 'Identity false',
    imagePath: './pictures/GodFather.jpg'
  },
  {
    name: 'Matador',
    side: 'mafia',
    ability: 'Can block someone ability',
    imagePath: './pictures/Matador.jpg'
  },
  {
    name: 'SaulGoodMan',
    side: 'mafia',
    ability: 'Can buy citizen who has no ability',
    imagePath: './pictures/SaulGoodMan.jpg'
  },
  {
    name: 'Regular Mafia',
    side: 'mafia',
    ability: 'none',
    imagePath: './pictures/mafia.jpeg'
  },
  {
    name: 'Leon',
    side: 'citizen',
    ability: 'can shot at night',
    imagePath: './pictures/Leon.jpg'
  },
  {
    name: 'Detective',
    side: 'citizen',
    ability: 'Can get identity of a player',
    imagePath: './pictures/Kin.jpg'
  },
  {
    name: 'Doctor',
    side: 'citizen',
    ability: 'Can save someone',
    imagePath: './pictures/DrWatson.jpg'
  },
  {
    name: 'Regular Citizen',
    side: 'citizen',
    ability: 'none',
    imagePath: './pictures/City.jpg'
  },

];

// Save the characters to MongoDB
characters.forEach((character) => {
  let imgBuffer = fs.readFileSync(character.imagePath);

  let newCharacter = new Character();
  newCharacter.name = character.name;
  newCharacter.side = character.side;
  newCharacter.ability = character.ability;
  newCharacter.image.data = imgBuffer;
  newCharacter.image.contentType = 'image/jpeg';

  newCharacter.save((err, savedCharacter) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Character ${savedCharacter.name} saved successfully!`);
    }
  });
});
