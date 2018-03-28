// @ts-check
const express = require('express')
const router = express.Router()
const database = require('../db/database')
const Account = require('../db/models/account')

// Login route
router.post('/login', (req, res, next) => {

  // If we have all info
  if (req.body.logemail && req.body.logpassword) {
    Account.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('401: Wrong email or password.')
        // err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/test')
      }
    })
  } else {
    var err = new Error('400: All fields required.')
    // err.status = 400
    return next(err)
  }
})

module.exports = router