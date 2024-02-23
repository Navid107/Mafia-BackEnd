function generateUniqueGameKey () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let gameKey = ''

  // Generate a random game key
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    gameKey += characters.charAt(randomIndex)
  }

  return gameKey
}

module.exports = generateUniqueGameKey
