// @ts-check
import Vue from 'vue'
import '../../public/style.css'

// Coloring
import randColor from 'randomcolor'
import Engine from './engine/engine'
import socketIO from 'socket.io-client'

// Choose color
let myColor = randColor()

// SocketIO
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

// Instantiate engine
let engine = new Engine({'color': myColor, 'rootDiv': 'canvas_container'})
engine.hello()
engine.start()

// TODO temp test
// import printMe from './print.js'

// Create UI
var app = new Vue({
  el: '#ui',
  data: {
    message: 'Hello Vue!'
  }
})