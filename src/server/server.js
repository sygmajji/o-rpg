var path = require('path')
var chokidar = require('chokidar');

var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var server = require('http').createServer(app);

var io = require('socket.io')(server)

// Webpack config
var webpack = require('webpack')
var webpackConfig = require('../../webpack.config.js')
var compiler = webpack(webpackConfig);

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
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
  console.log( 'A user connected' )

  socket.on('disconnect', function() {
    console.log( 'A user disconnected' )
  })

  socket.on('chat message', function(msg) {
    console.log( 'Message: ' + msg )
    io.emit('chat message', msg);
  })
})

// Retrieve database
var database = require('../db/database.js')()

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
var watcher = chokidar.watch('./src/server')

watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log("Clearing /server/ module cache from server")
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

// Init database
database.init(function() {
  server.listen(3000, function() {
    console.log( '[Server] Listening on port 3000!' )
  })
})



