const Game = require('../models/game.js');
const User = require('../models/user.js');
const Generate = require('../middleware/generateUniqueGameKey.js');
const Player = require('../models/player.js');
const Character = require('../models/char.js');

exports.hostGame = async (req, res) => {
  try {
    const userId = req.body.userId;
    const lobbyName = req.body.lobbyName;
    console.log('userID', userId);
    // Generate a unique game key
    const gameKey = Generate();

    // Find the user by ID
    const user = await User.findOne({ userId });
    console.log('user ', user)
    // Create a new game session in the database with the game key and host user
    const newGame = new Game({
      gameKey,
      host: userId, // Use the user object as the host reference
      lobbyName: lobbyName,
      players: [],
      // Add other game properties as needed
    });

    // Save the game session to the database
    await newGame.save();

    res.status(201).json({ message: 'Game created successfully', gameKey, lobbyName });
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
    console.log('game key ', gameKey, 'userID', userId, 'name', name);
    // Validate the game key and find the game
    const game = await Game.findOne({ gameKey });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if the user is already in the game
    if (game.players.find((player) => player._id.toString() === userId)) {
      return res.status(200).json({ message: 'You are already in this game' });
    }

    game.players.push({userId, name});
    console.log('line 56', userId, name);
    await game.save();
    res.status(200).json({ message: 'Joined the game successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join the game' });
  }
};

exports.lobbyGame = async (req, res) => {
  try {
    const userId = req.query.userId; // Get the user ID from the query parameter
    
    console.log("user id", userId )
    // Query the database to find lobbies created by the specific user
    const lobbies = await Game.find({ host: userId })
       // Select only the relevant fields
    console.log('lobbies', lobbies)
    res.json(lobbies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve lobbies' });
  }
};

exports.charsGame = async (req, res) => {
  try {
    // Retrieve character data from the database
    const characters = await Character.find();

    // Send the character data as JSON response
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.startGame = async (req, res) => {
  try {
    const gameId = req.body.gameKey;
    const userId = req.body.userId
    // Fetch the game by ID
    const game = await Game.findOne({gameKey: gameId});
    console.log('game host',game.host.toString() , 'userID', userId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if the host is starting the game
    if (game.host.toString() !== userId) {
      return res.status(403).json({ message: 'Only the host can start the game' });
    }
   
    // Ensure there are enough characters for the players
  
    const characters = await Character.find();
    // Shuffle the available characters array
    const shuffledCharacters = shuffleArray(characters);

    // Assign characters to players
    game.players.forEach((player) => {
      const randomIndex = Math.floor(Math.random() * shuffledCharacters.length);
      player.character = shuffledCharacters.splice(randomIndex, 1)[0];
    });

    // Save the game with assigned characters
    await game.save();

    res.status(200).json({ message: 'Game started successfully with assigned characters' });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ message: 'Failed to start the game' });
  }
};

// Function to shuffle an array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
