// gameRoutes.js

const express = require('express');
const router = express.Router();
const gameController = require('../../controller/gameController.js');

// Route to create a new game
router.post('/game', gameController.createGame);

// Route to assign roles to players
router.post('/assign-roles', gameController.assignRoles);

// Route to start the game
router.post('/start', gameController.startGame);

// Add more routes as needed for the game logic
router.get('/characters', gameController.chars);

router.get('/characters/image/:id', gameController.image);
  

module.exports = router;