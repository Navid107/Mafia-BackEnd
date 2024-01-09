const express = require('express')
const router = express.Router()
const gameController = require('../../controller/gameController.js')

// Route to create a new game
router.post('/host', gameController.hostGame)
router.post('/join', gameController.joinGame)
//PreGame lobby
router.post('/lobby', gameController.lobbyGame)
//Hosted/Joined lobbies in profile
router.post('/lobbies', gameController.lobbies)

router.post('/start', gameController.startGame)
router.post('/table', gameController.tableGame)
router.post('/table-update', gameController.nightActions)
router.delete('/table/:gameKey', gameController.deleteTable)

module.exports = router
