var path = require('path')
var config = require('../../config/usagi.conf')
var chokidar = require('chokidar');
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server)

// Webpack config
var webpack = require('webpack')
var webpackConfig = require('../../config/webpack.dev.conf.js')
var compiler = webpack(webpackConfig);

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
}))
app.use(require("webpack-hot-middleware")(compiler))

// Serve public files
app.use(express.static('public'))

// Include server routes as a middleware
app.use(function(req, res, next) {
  require('./routes/index.js')(req, res, next)
})
app.use(function(req, res, next) {
  require('./routes/login.js')(req, res, next)
})

// Netowork
io.on('connection', function(socket) {
  console.log( '[Dev-Server] A user connected' )

  socket.on('disconnect', function() {
    console.log( '[Dev-Server] A user disconnected' )
  })

  socket.on('chat message', function(msg) {
    console.log( '[Dev-Server] Message: ' + msg )
    io.emit('chat message', msg);
  })
})

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
var serverWatcher = chokidar.watch('./src/server')
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
// compiler.plugin('done', function() {
//   console.log("Clearing /client/ module cache from server")
//   Object.keys(require.cache).forEach(function(id) {
//     if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id]
//   })
// })

// Retrieve database
// var database = require('../db/database.js')(function() {
  server.listen(config.dev.port, function() {
    console.log( '[Dev-Server] Listening on port '+ config.dev.port + '!' )
  })
// })

var dbWatcher = chokidar.watch('./src/db')
dbWatcher.on('ready', function() {
  dbWatcher.on('all', function() {
    console.log('[Dev-Server] Clearing /db/ module cache from server')
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]db[\/\\]/.test(id)) delete require.cache[id]
    })
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id]
    })
    // Re require database
    database = require('../db/database.js')()
  })
})