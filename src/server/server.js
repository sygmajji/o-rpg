var path = require('path')
var chokidar = require('chokidar');

var express = require('express')
var app = express()
var server = require('http').createServer(app);

var io = require('socket.io')(server)

var webpack = require('webpack');
var webpackConfig = require('../../webpack.config.js');
var compiler = webpack(webpackConfig);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

// Serve public files
app.use(express.static('public'))


// Include server routes as a middleware
app.use(function(req, res, next) {
  require('./routes/index.js')(req, res, next);
});

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

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
var watcher = chokidar.watch('./src/server');

watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log("Clearing /server/ module cache from server");
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
    });
  });
});

// Do "hot-reloading" of client stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', function() {
  console.log("Clearing /client/ module cache from server");
  Object.keys(require.cache).forEach(function(id) {
    if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
  });
});

server.listen(3000, function() {
  console.log( 'O-RPG listening on port 3000!' )
})