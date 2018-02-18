import '../../public/style.css'

// Coloring
import randColor from 'randomcolor'
let myColor = randColor()

// SocketIO
import socketIO from 'socket.io-client'
let socket = socketIO()
$('form#message').submit(function() {
    socket.emit('chat message', myColor+$('#m').val())
    $('#m').val('')
    return false
})

socket.on('chat message', function(msg){
    let color = msg.substr(0, 7)
    let txt = msg.substr(7)
    if (txt == "")
        return
    $('#messages').append($('<li>').text(txt).css('color', color))

})

import Engine from './engine'
let engine = new Engine({'color': myColor})
engine.hello()
engine.start()

// import printMe from './print.js'

// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//        console.log('[Client] Accepting the updated printMe module!')
//          printMe()
//     })
//     module.hot.accept('./engine.js', function() {
//         console.log('[Client] Accepting the updated engine module!')
//         engine.stop()
//         engine = new Engine({'color': myColor})
//         engine.hello()
//         engine.start()
//     })
// }