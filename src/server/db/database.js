// @ts-check
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const localConf = require('../../../config/local.conf')

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
    mongoose.connect(dbAddress)

    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise

    // Get the default connection
    this._db = mongoose.connection

    // Bind connection to error event (to get notification of connection errors)
    this._db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  }

  getDB() {
    return this._db
  }

}
// let Database = function() {
//   this.db = null
//   this.init()
// }

// Database.prototype.hello = function () {
//   console.log('Hello database')
// }

// Database.prototype.init = function (callback) {
//   MongoClient.connect('mongodb://admin:FNCftw17@ds123124.mlab.com:23124/o-rpg', (err, database) => {
//   if (err) return console.log(err)
//   this.db = database
//   console.log("[Database] Connected to db")
//   // notify everyone else that the module is now ready
//   readyList.emit("ready")
//   // remove all listeners since this is a one-shot event
//   readyList.removeAllListeners("ready")
//   })
// }

// Database.prototype.getDB = function () {
//   return this.db
// }

// let database = new Database()
// module.exports = function (callback) {
//   if (typeof callback === 'function')
//   readyList.on("ready", callback)
  
//   return database
// }

// export default Database
let db = new Database()
module.exports = db