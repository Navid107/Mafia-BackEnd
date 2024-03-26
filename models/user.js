const mongoose = require('mongoose')

const playerStatsSchema = new mongoose.Schema({
  total_mafia: Number,
  mafia_wins: Number,
  mafia_loses: Number,
  total_citizen: Number,
  citizen_wins: Number,
  citizen_loses: Number
})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stats: playerStatsSchema
})

const User = mongoose.model('User', userSchema)

module.exports = User
