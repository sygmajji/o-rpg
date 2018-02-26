// @ts-check
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const localConf = require('../../../config/local.conf')
const SomeModel = require('./models/somemodel')

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

  connect(callback) {
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
      // this.saveEntry()
    })
    return promise
  }

  saveEntry() {
    // Create an instance of model SomeModel
    let awesome_instance = new SomeModel({ name: 'awesome', date: new Date() })

    // Save the new model instance, passing a callback
    awesome_instance.save(function (err) {
      if (err) this.handleError(err)
    })

    // Change record by modifying the fields, then calling save().
    awesome_instance.name = "New cool name"
    awesome_instance.save((err) => {
      if (err) return this.handleError(err)
    })
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