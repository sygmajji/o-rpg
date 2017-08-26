require('../../public/style.css')
var $ = require('jquery')

// Coloring
var randColor = require('randomcolor')
var myColor = randColor()

// SocketIO
var socket = require('socket.io-client')()
$('form').submit(function() {
    socket.emit('chat message', myColor+$('#m').val())
    $('#m').val('')
    return false
})

socket.on('chat message', function(msg){
    var color = msg.substr(0, 7)
    var txt = msg.substr(7)
    $('#messages').append($('<li>').text(txt).css('color', color))

})

// ThreeJS
var myCanvas = document.getElementById('my_canvas');
var width = 500
var height = 300
var THREE = require('three')
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 )
var renderer = new THREE.WebGLRenderer( { canvas : myCanvas, antialias : true} )
renderer.setSize( width, height )

var geometry = new THREE.BoxGeometry( 1, 1, 1 )
var material = new THREE.MeshBasicMaterial( { color: myColor } )
var cube = new THREE.Mesh( geometry, material )
scene.add( cube )

camera.position.z = 5

var animate = function () {
    requestAnimationFrame( animate )

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
};

animate()

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function() {
      //clearInterval(timer);
    });
  }