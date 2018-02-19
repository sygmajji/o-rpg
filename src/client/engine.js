// @ts-check
import * as THREE from 'three'

export default class Engine {
    constructor(params) {
        this.version = 0.2
        this.color = params.color || 0x333333
        this.req = null
        this.scene = null
        this.renderer = null
        this.camera = null
        this.cube = null
        this.win = params.win || window || null
    }
    hello() {
        console.log('[Engine] Hello version: ' + this.version)
    }

    start() {
        console.log('[Engine] Starting...')
        let myCanvas = document.getElementById('my_canvas')
        let width = 500
        let height = 300
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 )
        this.renderer = new THREE.WebGLRenderer( { canvas : myCanvas, antialias : true} )
        this.renderer.setSize( width, height )

        let geometry = new THREE.BoxGeometry( 1, 1, 1 )
        let material = new THREE.MeshBasicMaterial( { color: this.color } )
        this.cube = new THREE.Mesh( geometry, material )
        this.scene.add( this.cube )

        this.camera.position.z = 5
        this.mainLoop()
    }

    mainLoop() {
        let self = this

            let loop = function() {
                self.req = requestAnimationFrame( loop )
                self.cube.rotation.x += 0.01
                self.cube.rotation.y += 0.01
                self.renderer.render(self.scene, self.camera)
            }
            loop()
    }

    stop() {
        console.log('[Engine] Stopping... ')
        cancelAnimationFrame(this.req)
        this.scene = null
        this.renderer = null
        this.camera = null
    }
}