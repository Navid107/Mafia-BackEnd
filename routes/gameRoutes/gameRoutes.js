// gameRoutes.js

const express = require('express');
const router = express.Router();
const gameController = require('../../controller/gameController.js');

// Route to create a new game
router.post('/host', gameController.hostGame);
router.post('/join', gameController.joinGame);
router.get('/lobby', gameController.lobbyGame);
router.get('/character', gameController.charsGame);

module.exports = router;