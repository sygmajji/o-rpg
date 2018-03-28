// @ts-check
const path = require('path')
const config = require('../../config/usagi.conf')
const chokidar = require('chokidar')
const express = require('express')
const session = require('express-session')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const database = require('./db/database')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

// Webpack config
const webpack = require('webpack')
const webpackConfig = require('../../config/webpack.dev.conf.js')
const compiler = webpack(webpackConfig)

// Retrieve local conf
const localFilename = '../../config/local.conf'
let localConf
try {
  localConf = require(localFilename)
}
catch (err) {
  localConf = {}
  console.log("[Dev-Server] Unable to read file '" + localFilename + "': ", err)
}

// Set views
app.set('views', path.join(__dirname, 'src/server/views'))
// app.set('view engine', 'pug')

// Logger
app.use(logger('dev'))

// Retrieve database
var db = mongoose.connection;

// Session
app.use(session({
  secret: localConf.sessionSecret,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(require("webpack-dev-middleware")(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
}))
// app.use(require("webpack-hot-middleware")(compiler))

// Serve public files
app.use(express.static(path.join(__dirname, 'public')))

// Include server routes as a middleware
app.use(function(req, res, next) {
  require('./routes/index.js')(req, res, next)
})
app.use(function(req, res, next) {
  require('./routes/login.js')(req, res, next)
})
app.use(function(req, res, next) {
  require('./routes/logout.js')(req, res, next)
})
app.use(function(req, res, next) {
  require('./routes/register.js')(req, res, next)
})

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('404: Not Found')
  next(err)
})

// Error handler
// TODO See https://expressjs.com/en/guide/error-handling.html
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Netowork
io.on('connection', function(socket) {
  console.log( '[Dev-Server] A user connected' )

  socket.on('disconnect', function() {
    console.log( '[Dev-Server] A user disconnected' )
  })

  socket.on('chat message', function(msg) {
    console.log( '[Dev-Server] Message: ' + msg )
    io.emit('chat message', msg)
  })
})

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
let serverWatcher = chokidar.watch('./src/server')
serverWatcher.on('ready', function() {
  serverWatcher.on('all', function() {
    console.log('[Dev-Server] Clearing /server/ module cache from server')
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id]
    })
  })
})

// Do "hot-reloading" of client stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', function() {
  console.log("Clearing /client/ module cache from server")
  Object.keys(require.cache).forEach(function(id) {
    if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id]
  })
})

// let dbWatcher = chokidar.watch('./src/db')
// dbWatcher.on('ready', function() {
//   dbWatcher.on('all', function() {
//     console.log('[Dev-Server] Clearing /db/ module cache from server')
//     Object.keys(require.cache).forEach(function(id) {
//       if (/[\/\\]db[\/\\]/.test(id)) delete require.cache[id]
//     })
//     Object.keys(require.cache).forEach(function(id) {
//       if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id]
//     })
//     // // Re require database
//     // database = require('../db/database.js')()
//   })
// })

// Wait for database and start server
let promise = database.connect()
promise.then(
  // Success
  () => {
    server.listen(config.dev.port, function() {
      console.log('[Dev-Server] Listening on port '+ config.dev.port + '!')
    })
  },
  // Error
  err => {
    console.log('[Dev-Server] Could not connect to database.', err)
  }
)

