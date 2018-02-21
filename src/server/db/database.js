// @ts-check
const MongoClient = require('mongodb').MongoClient
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
    MongoClient.connect('mongodb://admin:FNCftw17@ds123124.mlab.com:23124/o-rpg', (err, client) => {
      if (err) return console.log(err)
      this._db = client.db('o-rpg')
      
      const collection = this._db.collection('accounts')
      // console.log(collection)/
      console.log("[Database] Connected to db")
      // notify everyone else that the module is now ready
      // readyList.emit("ready")
      // remove all listeners since this is a one-shot event
      // readyList.removeAllListeners("ready")

      // readyList.on("ready", callback)
      if (callback !== undefined && typeof callback === 'function') {
        callback();
      }
    })
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