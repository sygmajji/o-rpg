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
    if (txt == "")
        return
    $('#messages').append($('<li>').text(txt).css('color', color))

})

var engine = require('./engine.js')({'color': myColor})
engine.hello()
engine.start()

import printMe from './print.js';

if (module.hot) {
    module.hot.accept('./print.js', function() {
       console.log('[Client] Accepting the updated printMe module!')
         printMe()
    })
    module.hot.accept('./engine.js', function() {
        console.log('[Client] Accepting the updated engine module!')
        engine = require('./engine.js')({'color': myColor})
        engine.hello()
        engine.start()
    })
}