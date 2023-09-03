// routes/game.js
const express = require('express');
const router = express.Router();

// Authentication route - Register a new user
app.post('/api/register', registerController.register);

// Authentication route - Login
app.post('/api/login', authController.login);

// Define the routes for the game
router.post('/create', (req, res) => {
  // Implement the logic to create a new game and save it to the database
  // For now, we can just return a success message
  res.json({ message: 'Game created successfully!' });
});

router.get('/players', (req, res) => {
  // Implement the logic to fetch the list of players in the current game from the database
  // For now, let's return a sample list of players
  const players = [
    { id: 1, name: 'Player 1', role: 'Mafia' },
    { id: 2, name: 'Player 2', role: 'Townsperson' },
    { id: 3, name: 'Player 3', role: 'Townsperson' },
    // Add more players here
  ];
  res.json(players);
});

module.exports = router;
