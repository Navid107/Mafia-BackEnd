const Game = require('../models/game.js');
const User = require('../models/user.js');
const Generate = require('../middleware/generateUniqueGameKey.js');
const Player = require('../models/player.js');
const Character = require('../models/char.js');
const Table = require('../models/table.js')

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
      gameState: "false"
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
    const username = req.body.name;
    console.log('game key ', gameKey, 'userID', userId, 'name', username);
    // Validate the game key and find the game
    const game = await Game.findOne({ gameKey });

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    if (game.gameState === 'started') {
      return res.status(200).json({ message: 'Game already started' });
    }

    // Check if the user is already in the game
    if (game.players.find((player) => player.userIdm === userId)) {
      return res.status(200).json({ message: 'You are already in this game' });
    }

    game.players.push({ userId: userId, name: username });
    console.log('line 56', userId, username);
    await game.save();
    res.status(200).json({ message: 'Joined the game successfully' });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: 'Failed to join the game' });
  }
};

exports.lobbyGame = async (req, res) => {
  try {

    const gameKey = req.body.gameKey;
    const perGameLobby = await Game.find({ gameKey: gameKey })
    const tableExists = await Table.find({ gameKey })
    //const host = perGameLobby.host.toString();
    //console.log("player 79", perGameLobby,)

    // Query the database to find lobbies created by the specific user
    //const lobbies = await Game.find({ host})
    // Select only the relevant fields
    // console.log("player ", player)
    // console.log(`lobbies, ${(lobbies)}`)
    // Use the find method to search for a player with a matching userId
    //console.log('player', player)
    //console.log("lobbies", perGameLobby );
    if (tableExists) {
      res.status(201)
    }
    res.json(perGameLobby);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve lobbies' });
  }
};

exports.charsGame = async (req, res) => {
  try {
    // Retrieve character data from the database
    const characters = await Character.find();

    //console.log('found char',characters)
    // Send the character data as JSON response
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.startGame = async (req, res) => {
  try {
    const gameKey = req.body.gameKey;
    const userId = req.body.userId;
    const selectedChars = req.body.selectedChars;

    console.log('selected char ',selectedChars)

    // Fetch the game by ID
    const game = await Game.find({ gameKey: gameKey });
    
    console.log('game host', game[0].host, 'userID', userId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const playersInLobby = game[0].players.slice()
    console.log('players in lobby ', playersInLobby)
    const host = game[0].host.toString();

    // Check if the host is starting the game
    if (host !== userId) {
      return res.status(403).json({ message: 'Only the host can start the game' });
    }
    const getUserWithRole = getACharacter(playersInLobby, selectedChars)
    console.log('get user with roles',getUserWithRole);
    const newTable = new Table({
      gameKey: gameKey,
      host: host,
      nights: { players: getUserWithRole }
    });
    game.gameState = 'true';
    await newTable.save();

    res.status(200).json({ message: 'Game started successfully with assigned characters' });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ message: 'Failed to start the game' });
  }
};


exports.tableGame = async (req, res) => {
  const gameKey = req.body.gameKey
  const userId = req.body.userId;
  const playerInfo = []
  console.log('userId', userId, 'gameKey', gameKey)
  try {
    // Find Game by key and check if it exists or not
    const sits = await Table.find({ gameKey: gameKey });
    //console.log('Hosts ', sits)

    if (sits[0].host === userId) {
      
      console.log('host info sent', sits[0].nights.length-1 )
      res.status(200).json(sits[0])
    } else {
      sits[0].players.forEach(player => {
        if (player.userId === userId) {
          playerInfo.push(player)
          //console.log('player info sent')
          res.json(playerInfo)

        }
      })
    }
  } catch (err) {
    console.log("ERROR", err)
    res.status(500).json({ message: 'somethings went wrong' })
  }
}

exports.nightActions = async (req, res) => {
  const gameKey = req.body.gameKey;
  const userId = req.body.hostId;
  const players = req.body.players;

  console.log('userId', userId, 'gameKey', gameKey,
     'updated form', players);

  try {
    try {
      const result = await Table.updateOne(
        { gameKey: gameKey },
        { $push: { nights: {players} } }
      );
      console.log('Document updated successfully:', result);
    } catch (error) {
      console.error('Error updating document:', error);
    }
    
   /*  if (!updatedTable) {
      return res.status(404).send('Table not found');
    }
   if(userId === updatedTable[0].host) {
      await updatedTable.save();
      console.log('updatedTable work',  );
    } else {
      console.log('updatedTable didnt work')
    }*/
    res.status(200).send('Night action successfully updated');
  } catch (error) {
    console.error('Error updating night action:', error);
    res.status(500).send('Internal server error');
  }
};

exports.lobbies = async (req, res) => {
  try {

    const userId = req.body.userId; // Get the user ID from the query parameter

    console.log("user id", userId)

    const joined = await Game.find({ 'players.userId': userId })

    // Query the database to find lobbies created by the specific user
    const hosted = await Game.find({ host: userId })
    // Select only the relevant fields
    console.log(`lobbies, ${(hosted)}`)
    // Use the find method to search for a player with a matching userId
    //console.log('player', player)


    res.status(200).json({ hosted, joined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve lobbies' });
  }
}

// this function assigns ever user with a char
function getACharacter(userInLobby, selectedChars) {
  let characters = selectedChars.slice();
  let users = userInLobby.slice();
  const availableExtraChar = [
    {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    }, {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    },
    {
      id: 10,
      name: 'Regular Mafia',
      side: 'mafia',
      ability: false,
      death: false,
    }, {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    }, {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    },
    {
      id: 10,
      name: 'Regular Mafia',
      side: 'mafia',
      ability: false,
      death: false,
    }, {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    }, {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    }, {
      id: 10,
      name: 'Regular Mafia',
      side: 'mafia',
      ability: false,
      death: false,
    }, {
      id: 9,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: true,
      death: false,
    },
  ];

  while (users.length > characters.length) {
    characters.push(availableExtraChar[characters.length % availableExtraChar.length]);
  }
  while (characters.length > users.length) {
    users.push(userInLobby[users.length % userInLobby.length]);
  }
  characters = characters.sort(() => Math.random() - 0.5);
  users = users.sort(() => Math.random() - 0.5);
  const result = [];
  for (let i = 0; i < users.length; i++) {
    result.push({
      playerId: users[i].userId,
      playerName: users[i].name,
      char: {
        id: characters[i].id,
        name: characters[i].name,
        side: characters[i].side,
        ability: characters[i].ability,
        death: characters[i].death,
      }
    });
  }
  console.log(result)
  return result;
}