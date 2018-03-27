// @ts-check
// Require Mongoose
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Define a schema
let Schema = mongoose.Schema
let AccountSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  creationDate: Date
})

// Hash password before saving it
AccountSchema.pre('save', function (next) {
  let user = this
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err)
    }
    user.password = hash
    next()
  })
})

// Static function to authenticate input against database
AccountSchema.static('authenticate', function (email, password, callback) {
  // Find account
  Account.findOne({ email: email })
  .exec(function (err, user) {
    // Check errors
    if (err) {
      return callback(err)
    } else if (!user) {
      let err = new Error('401: User not found.');
      return callback(err)
    }
    // Check password
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user)
      } else {
        return callback()
      }
    })
  })
})

// Compile model only if not already existing
var Account
try {
  Account = mongoose.model('Account')
} catch (error) {
  Account = mongoose.model('Account', AccountSchema)
}
module.exports = Account
