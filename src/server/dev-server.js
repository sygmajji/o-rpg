// @ts-check
const path = require('path')
const config = require('../../config/usagi.conf')
// const chokidar = require('chokidar')
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const database = require('./db/database')

// Webpack config
const webpack = require('webpack')
const webpackConfig = require('../../config/webpack.dev.conf.js')
const compiler = webpack(webpackConfig)

// Set views
app.set('views', path.join(__dirname, 'src/server/views'))
// app.set('view engine', 'pug')

// Logger
app.use(logger('dev'))

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

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  let status = 404;
  next({err, status})
})

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send("Error " + (err.status || 500))
});

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
// let serverWatcher = chokidar.watch('./src/server')
// serverWatcher.on('ready', function() {
//   serverWatcher.on('all', function() {
//     console.log('[Dev-Server] Clearing /server/ module cache from server')
//     Object.keys(require.cache).forEach(function(id) {
//       if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id]
//     })
//   })
// })

// Do "hot-reloading" of client stuff on the server
// Throw away the cached client modules and let them be re-required next time
// compiler.plugin('done', function() {
//   console.log("Clearing /client/ module cache from server")
//   Object.keys(require.cache).forEach(function(id) {
//     if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id]
//   })
// })

// Retrieve database
// let database = require('../db/database.js')(function() {
//   server.listen(config.dev.port, function() {
//     console.log( '[Dev-Server] Listening on port '+ config.dev.port + '!' )
//   })
// })
database.connect(() => {
  console.log('!!!! conneceted to db')
    server.listen(config.dev.port, function() {
      console.log( '[Dev-Server] Listening on port '+ config.dev.port + '!' )
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