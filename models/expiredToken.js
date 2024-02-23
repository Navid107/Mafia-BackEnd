const mongoose = require('mongoose')
const expireTokenSchema = new mongoose.Schema(
  {
    token: {
      user: String,
      userId: String
    }
  },
  { timestamps: true }
)
const ExpireToken = mongoose.model('ExpireToken', expireTokenSchema)
module.exports = ExpireToken
