var express = require('express')
var path = require('path')
var app = express()
var server = require('http').createServer(app);
var webpack = require('webpack');
var webpackConfig = require('../../webpack.config.js');
var compiler = webpack(webpackConfig);
var io = require('socket.io')(server)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

// Serve public files
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile( path.join ( __dirname, '../../dist', 'index.html') )
})

app.get('/bundle.js', function (req, res) {
  res.sendFile( path.join( __dirname, '../../dist', 'bundle.js' ) )
})

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

server.listen(3000, function() {
  console.log( 'Example app listening on port 3000!' )
})