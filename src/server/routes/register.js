// @ts-check
const express = require('express')
const router = express.Router()
const database = require('../db/database')
const Account = require('../db/models/account')

// Register route
router.post('/register', (req, res, next) => {

  // If password do not match return error
  if (req.body.password !== req.body.passwordConf) {
    let err = new Error('400: Passwords do not match.')
    res.send("Passwords dont match")
    return next(err)
  }

  // If we have all info
  if (req.body.email && req.body.username &&
      req.body.password && req.body.passwordConf) {

    // Account data
    let accountData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    // Insert data into database
    Account.create(accountData, function (err, user) {
      if (err) {
        return next(err);
      } else {
        req.session.userId = user._id
        return res.redirect('/')
      }
    })
  } else {
    var err = new Error('400: All fields required.')
    // err.status = 400
    return next(err)
  }
})

module.exports = router