const Game = require('../models/game.js');
const User = require('../models/user.js');
const Generate = require('../middleware/generateUniqueGameKey.js');
const Player = require('../models/player.js');


exports.hostGame = async (req, res) => {
  try {
    const userId = req.body._id;
    // Generate a unique game key
    const gameKey = Generate();
    const user = await User.findOne({ userId });
    console.log(user); 
    // Create a new game session in the database with the game key and host user
    const newGame = new Game({
      gameKey,
      host: user, // Assuming you have user authentication
      players: [], // Add the host as the first player
      // Add other game properties as needed
    });
  
    // Save the game session to the database
    await newGame.save();
    console.log('game key ',gameKey);
    res.status(201).json({ message: 'Game created successfully', gameKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create a game' });
  }
};

exports.joinGame = async (req, res) => {
  try {
    const gameKey = req.body.gameKey; // Get the game key from the request
    const userId = req.body.userId;
    const name = req.body.name;
    console.log('game key ',gameKey,'userID', userId,'name' ,name);
    // Validate the game key and find the game
    const game = await Game.findOne({ gameKey });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if the user is already in the game
    if (game.players.find((player) => player._id.toString() === userId)) {
      return res.status(200).json({ message: 'You are already in this game' });
    }

    // Add the user to the list of players with their nickname
    const newPlayer = new Player({
      _id: userId,
      name: name,
      role: '',
      side: '',
    });
    game.players.push(newPlayer);
    await game.save();
    res.status(200).json({ message: 'Joined the game successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join the game' });
  }
};
