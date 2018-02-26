#! /usr/bin/env node
// @ts-check
console.log('This script populates the database')

const async = require('async')
const SomeModel = require('./models/somemodel')
const localConf = require('../../../config/local.conf')
const mongoose = require('mongoose')

let dbAddress = 'mongodb://' + localConf.dbid + ':' + localConf.dbpass + '@' + localConf.dburl + '/' + localConf.dbname
mongoose.connect(dbAddress)
mongoose.Promise = global.Promise
var db = mongoose.connection
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

var somemodels = []

function somemodelCreate(name, date, cb) {
  var smDetails = { name: name, date: date }
  var sm = new SomeModel(smDetails)

  sm.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New model: ' + sm)
    somemodels.push(sm)
    cb(null, sm)
  })
}

function createGenreAuthors(cb) {
  async.parallel([
    function(callback) {
      somemodelCreate('Bob', new Date(), callback)
    },
    function(callback) {
      somemodelCreate('Ben', new Date(), callback)
    },
    function(callback) {
      somemodelCreate('Isaac', new Date(), callback)
    },
    function(callback) {
      somemodelCreate('Bob', new Date(), callback)
    },
    function(callback) {
      somemodelCreate('Jim', new Date(), callback)
    },
  ],
  // optional callback
  cb)
}

async.series([
  createGenreAuthors
  // More here
],
// Optional callback
function(err, results) {
  if (err) {
    console.log('Error: ' + err)
  }
  else {
    console.log('Finished')
    
  }
  // All done, disconnect from database
  mongoose.connection.close()
})
