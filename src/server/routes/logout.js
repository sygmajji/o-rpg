// @ts-check
const express = require('express')
const router = express.Router()
const database = require('../db/database')
const Account = require('../db/models/account')

// Logout route
router.get('/logout', function (req, res, next) {

  // Delete session object
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
})

module.exports = router