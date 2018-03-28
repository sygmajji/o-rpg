#! /usr/bin/env node
// @ts-check
console.log('[Populate] This script populates the database')

const async = require('async')
const Account = require('./models/account')
const mongoose = require('mongoose')

// Retrieve local conf
const localFilename = '../../../config/local.conf'
let localConf
try {
  localConf = require(localFilename)
}
catch (err) {
  localConf = {}
  console.log("[Populate] Unable to read file '" + localFilename + "': ", err)
}

let dbAddress = 'mongodb://' + localConf.dbid + ':' + localConf.dbpass + '@' + localConf.dburl + '/' + localConf.dbname
mongoose.connect(dbAddress)
mongoose.Promise = global.Promise
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

// TODO fix errors
// Create accounts
var accounts = []
function accountCreate(email, name, pass, date, cb) {
  let accountDetails = { email: email, username: name, password: pass, creationDate: date }
  var account = new Account(accountDetails)

  account.save(function (err) {
    if (err) {
      cb(err, null)
      console.log('[Populate]' + err)
      return
    }
    console.log('[Populate] New account: ' + account)
    accounts.push(account)
    cb(null, account)
  })

  cb(null, account)
}

function createTestAccounts(cb) {
  async.parallel([
    function(callback) {
      accountCreate('bob@silmaris.org', 'Bob', 'toto', new Date(), callback)
    },
    function(callback) {
      accountCreate('jim@silmaris.org', 'Jim', 'toto', new Date(), callback)
    },
    function(callback) {
      accountCreate('bobby@silmaris.org', 'Bobby', 'toto', new Date(), callback)
    },
  ], cb)
}

async.series([
  createTestAccounts
  // More here
],
// Optional callback
function(err, results) {
  if (err) {
    console.log('[Populate] Error: ' + err)
  }
  else {
    console.log('[Populate] Finished')
  }
  // All done, disconnect from database
  mongoose.connection.close()
})
