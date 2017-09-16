import * as THREE from 'three'

var Engine = function(params) {
    this.version = 0.1
    this.color = params.color || 0x333333
    this.req = null
    this.scene = null
    this.renderer = null
    this.camera = null
    this.cube = null
    this.win = params.win || window || null
}
Engine.prototype.hello = function () {
    console.log('[Engine] Hello version: ' + this.version)
}

Engine.prototype.start = function () {
    console.log('[Engine] Starting...')
    var myCanvas = document.getElementById('my_canvas');
    var width = 500
    var height = 300
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 )
    this.renderer = new THREE.WebGLRenderer( { canvas : myCanvas, antialias : true} )
    this.renderer.setSize( width, height )

    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial( { color: this.color } )
    this.cube = new THREE.Mesh( geometry, material )
    this.scene.add( this.cube )

    this.camera.position.z = 5
    this.mainLoop()
}

Engine.prototype.mainLoop = function () {
    var self = this;

    var loop = function() {
        self.req = requestAnimationFrame( loop )
        self.cube.rotation.x += 0.01
        self.cube.rotation.y += 0.01
        self.renderer.render(self.scene, self.camera)
    }
    loop()
}

Engine.prototype.stop = function stop() {
    console.log('[Engine] Stopping... ')
    cancelAnimationFrame(this.req)
    this.scene = null
    this.renderer = null
    this.camera = null
}

var engine = null

module.exports = function (params) {
    if (engine == null)
        engine = new Engine(params)
    return engine
}

if (module.hot) {
    module.hot.dispose(function() {
        engine.stop()
    })
}