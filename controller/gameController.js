const Game = require('../models/game.js')
const Generate = require('../middleware/generateUniqueGameKey.js')
const Table = require('../models/table.js')
const User = require('../models/user.js')
const { ObjectId } = require('mongodb')
// Hosting a lobby
exports.hostGame = async (req, res) => {
  try {
    const userId = req.userId
    const lobbyName = req.body.lobbyName
    // Generate a unique game key
    const gameKey = Generate()

    // Create a new game session in the database with the game key and host user
    const newGame = new Game({
      gameKey,
      host: userId,
      lobbyName: lobbyName,
      gameState: 'false'
    })

    // Save the game session to the database
    await newGame.save()
    res
      .status(201)
      .json({ message: 'Game created successfully', gameKey, lobbyName })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create a game' })
  }
}

// User can join lobbies with the gameKeys
exports.joinGame = async (req, res) => {
  try {
    const gameKey = req.body.gameKey
    const userId = req.userId
    const username = req.body.name

    // Validate the game key and find the game
    const game = await Game.findOne({ gameKey })

    // Validating the game
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }
    if (game.gameState === 'started') {
      return res.status(200).json({ message: 'Game already started' })
    }

    // Check if the user is already in the game
    if (game.players.find(player => player.userIdm === userId)) {
      return res.status(200).json({ message: 'You are already in this game' })
    }

    game.players.push({ userId: userId, name: username })
    //console.log('line 56', userId, username)
    await game.save()

    res.status(201).json({ message: 'Joined the game successfully' })
  } catch (err) {
    console.error(err)

    res.status(500).json({ message: 'Failed to join the game' })
  }
}

// This function sends preGameLobby
exports.perGameLobby = async (req, res) => {
  try {
    const gameKey = req.body.gameKey
    const perGameLobby = await Game.find({ gameKey: gameKey })

    res.json(perGameLobby)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to retrieve lobbies' })
  }
}

// When everyone joins the lobby and host starts the game
// and every player receives a character
exports.startGame = async (req, res) => {
  try {
    const gameKey = req.body.gameKey
    const userId = req.body.hostId
    const selectedChars = req.body.selectedChars

    // Fetch the game by ID
    const game = await Game.find({ gameKey: gameKey })

    // Verify that the user is authorized to start the game
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }
    const playersInLobby = game[0].players.slice()
    const host = game[0].host.toString()

    // Check if the host is starting the game
    if (host !== userId) {
      return res
        .status(403)
        .json({ message: 'Only the host can start the game' })
    }
    const getUserWithRole = getACharacter(playersInLobby, selectedChars)

    // Add the player character information to the game object and save it to the database
    const newTable = new Table({
      gameKey: gameKey,
      host: host,
      gameOver: '',
      nights: { players: getUserWithRole }
    })
    // Updating the Game State
    await Game.updateOne(
      { gameKey: gameKey },
      {
        $set: { gameState: true }
      }
    )

    await newTable.save()

    res
      .status(200)
      .json({ message: 'Game started successfully with assigned characters' })
  } catch (error) {
    console.error('Error starting game:', error)
    res.status(500).json({ message: 'Failed to start the game' })
  }
}

// Sending the game data to Host and every Players
exports.tableGame = async (req, res) => {
  const gameKey = req.body.gameKey
  const userId = req.body.userId

  // pushing every player beside on their userID
  // and send it to the front end
  const playerInfo = []

  try {
    // Find Game by key and check if it exists or not
    const seats = await Table.find({ gameKey: gameKey })
    // if the userId matches the hostId, it will send hostData
    if (seats[0]?.host === userId) {
      res.status(200).json(seats[0])
    } else {
      // check userId and send only that player's data
      seats[0]?.nights[0].players.forEach(player => {
        if (player.playerId === userId) {
          playerInfo.push(player)
          res.status(200).json(playerInfo)
        }
      })
    }
  } catch (err) {
    console.log('ERROR', err)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// NightAction form update and updating the game
exports.nightActions = async (req, res) => {
  const gameKey = req.body.gameKey
  const nightAction = req.body.players

  try {
    // checking the winning condition
    const { gameOver, players } = await checkWinningCondition(nightAction)
    //Updates players stats when it gets called 
    const updatePlayerStats = async (players) => {
      for (const player of players) {
        //updateStats function receives 3 arguments, player,side,winner team.
        await updateStats(player.playerId, player.char.side, gameOver);
      }
    };
    
    // Checking if the game has a winner
    if (!gameOver) {
      await Table.updateOne(
        { gameKey: gameKey },
        { $push: { nights: { players } } }
      )
    } else {
      // Updating the night action
      await Table.updateOne(
        { gameKey: gameKey },
        {
          $set: { gameOver: gameOver },
          $push: { nights: { players } }
        }
      )
     //Updating players stats if theres winning 
        .then(() => {
          updatePlayerStats(nightAction)
        })
        .catch((error) => {
          throw error;
        });
      
      // Getting all players in the game to see who won
    }
    res.status(200).send('Night action successfully updated')
  } catch (error) {
    console.error('Error updating night action:', error)
    res.status(500).send('Internal server error')
  }
}

// Deleting the table
exports.deleteTable = async (req, res) => {
  const { gameKey } = req.params

  try {
    // Find and delete the document with the specified gameKey
    await Game.deleteOne({ gameKey })
    const deleteTable = await Table.deleteOne({ gameKey })

    if (deleteTable) {
      // Send success response
      res.status(200).json({
        message: `Table entry with gameKey '${gameKey}' has been deleted.`
      })
    } else {
      // Send 404 response if no entry found
      res
        .status(404)
        .json({ message: `No table entry found with gameKey '${gameKey}'.` })
    }
  } catch (error) {
    console.error('Error deleting game:', error)

    // Send 500 response for other errors
    res.status(500).json({ message: 'Internal server error.' })
  }
}

// The hosted/joined Lobbies that show in the profile
exports.lobbies = async (req, res) => {
  try {
    const userId = req.userId
    console.log('userId ', userId)
    // User joined Lobbies
    const joined = await Game.find({ 'players.userId': userId })
    // User Hosted Lobbies
    const hosted = await Game.find({ host: userId })

    res.status(200).json({ hosted, joined })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to retrieve lobbies' })
  }
}

// This function assigns every user with a character
function getACharacter (userInLobby, selectedChars) {
  // Make copies of selected characters and lobby users arrays
  let characters = selectedChars.slice()
  let users = userInLobby.slice()
  // Available extra characters to fill in if players exceed character count
  const availableExtraChar = [
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    },
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    },
    {
      id: 9,
      name: 'Regular Mafia',
      side: 'mafia',
      ability: false,
      death: false
    },
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    },
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    },
    {
      id: 9,
      name: 'Regular Mafia',
      side: 'mafia',
      ability: false,
      death: false
    },
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    },
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    },
    {
      id: 9,
      name: 'Regular Mafia',
      side: 'mafia',
      ability: false,
      death: false
    },
    {
      id: 8,
      name: 'Regular Citizen',
      side: 'citizen',
      ability: false,
      death: false
    }
  ]
  // If the numbers of the players are larger, this function adds more chars
  while (users.length > characters.length) {
    characters.push(
      availableExtraChar[characters.length % availableExtraChar.length]
    )
  }
  // Fill in users array if there are fewer players than characters
  while (characters.length > users.length) {
    users.push(userInLobby[users.length % userInLobby.length])
  }
  // Randomize the order of characters and users arrays
  characters = characters.sort(() => Math.random() - 0.5)
  users = users.sort(() => Math.random() - 0.5)

  // Create an array to store the result of player and character assignment
  const result = []
  for (let i = 0; i < users.length; i++) {
    result.push({
      playerId: users[i].userId,
      playerName: users[i].name,
      char: {
        id: characters[i].id,
        name: characters[i].name,
        side: characters[i].side,
        ability: characters[i].ability,
        death: characters[i].death
      }
    })
  }
  return result
}

// Checking if we have winners
const checkWinningCondition = async nightAction => {
  const alivePlayers = nightAction.filter(player => player.char.death === false)

  // Assuming players have a 'side' property indicating their side (mafia or citizen)
  const mafiaCount = alivePlayers.filter(
    player => player.char.side === 'mafia'
  ).length
  const citizenCount = alivePlayers.filter(
    player => player.char.side === 'citizen'
  ).length

  let result = {
    gameOver: '',
    players: nightAction
  }
  // If Mafia wins
  if (mafiaCount >= citizenCount) {
    result.players = nightAction.filter(player => 
      player.char.side === 'mafia')
    result.gameOver = 'mafia'
  }

  // If Citizen wins
  else if (citizenCount > 0 && mafiaCount === 0) {
    result.players = nightAction.filter(player => 
      player.char.side === 'citizen')
    result.gameOver = 'citizen'
  }
  // Game continuos
  else {
    result.players = nightAction
    result.gameOver = ''
  }

  return result
}
//PlayerStat update function
 const updateStats = async (player, side, winnerTeam) =>{
  const total_side = `total_${side}` //total game on side
  const side_wins = `${side}_wins`  //wins
  const side_loses = `${side}_loses`//loses

  const playerStat = await User.findOne({ '_id': player })
  if (!playerStat) {
    console.error('User not found');
    return;
  }
  const stats = playerStat.stats
  if( side === winnerTeam ) {
    stats[total_side] += 1;
    stats[side_wins] += 1;
    console.log(stats)
  } else {
    stats[total_side] += 1;
    stats[side_loses] += 1;
    console.log(stats)
  }
  await playerStat.save();
}
  

