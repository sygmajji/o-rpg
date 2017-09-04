require('../../public/style.css')

// Coloring
var randColor = require('randomcolor')
var myColor = randColor()

// SocketIO
var socket = require('socket.io-client')()
$('form#message').submit(function() {
    socket.emit('chat message', myColor+$('#m').val())
    $('#m').val('')
    return false
})

socket.on('chat message', function(msg){
    var color = msg.substr(0, 7)
    var txt = msg.substr(7)
    $('#messages').append($('<li>').text(txt).css('color', color))

})

var engine = require('./engine.js')({'color': myColor})
engine.hello()
engine.start()

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function() {
      engine.stop()
    });
}

// if (module.hot) {
//     module.hot.accept(['./engine.js', './client.js'], function() {
//         console.log('Accepting the updated engine module!')
//     })
//     module.hot.dispose(function() {
//         engine.stop()
//     })
//     module.hot.accept()
// }