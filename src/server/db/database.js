// @ts-check
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')

// Retrieve local conf
const localFilename = '../../../config/local.conf'
let localConf
try {
  localConf = require(localFilename)
}
catch (err) {
  localConf = {}
  console.log("[Dev-Server] Unable to read file '" + localFilename + "': ", err)
}

// const EventEmitter = require('events')
// const readyList = new EventEmitter()

/** Engine class */
class Database {
  /** Constructs the Pioneer engine. */
  constructor() {
    this._db = null
  }
  hello() {
    console.log('Hello database')
  }

  connect() {
    // Set up default mongoose connection
    let dbAddress = 'mongodb://' + localConf.dbid + ':' + localConf.dbpass + '@' + localConf.dburl + '/' + localConf.dbname
    let promise = mongoose.connect(dbAddress)

    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise

    // Get the default connection
    this._db = mongoose.connection

    // Bind connection to error event (to get notification of connection errors)
    this._db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    this._db.once('open', () => {
    })
    return promise
  }

  handleError(err) {
    // Print error in debug mode
    console.log('[Database] Error', err)
  }

  getDB() {
    return this._db
  }
}

// Export database instance
let db = new Database()
module.exports = db