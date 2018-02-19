// @ts-check
import * as THREE from 'three'

/** Engine class */
class Engine {
  /** Constructs the Pioneer engine.
  * @param {Object} params - parameters object. */
  constructor(params) {
    this._version = 0.2
    this._color = params.color || 0x333333
    this._req = null
    this._scene = null
    this._renderer = null
    this._camera = null
    this._cube = null
    this._win = params.win || window || null
    this._rootDiv = document.getElementById(params.rootDiv)
    this._thisLoop = this.__mainLoop.bind(this)
  }
  /** Print hello messqge and version. */
  hello() {
    console.log('[Engine] Hello version: ' + this._version)
  }
  
  /** Start engine. */
  start() {
    console.log('[Engine] Starting...')
    this._canvas = document.createElement('canvas')
		this._rootDiv.appendChild(this._canvas)

    let width = 500
    let height = 300
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 )
    this._renderer = new THREE.WebGLRenderer( { canvas : this._canvas, antialias : true} )
    this._renderer.setSize( width, height )
    
    let geometry = new THREE.BoxGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial( { color: this._color } )
    this._cube = new THREE.Mesh( geometry, material )
    this._scene.add( this._cube )
    
    this._camera.position.z = 5
    // Start looping.
		this._req = requestAnimationFrame(this.__mainLoop.bind(this))
  }
  
  /** Main loop function.
	 * @package */
  __mainLoop() {
    this._cube.rotation.x += 0.01
    this._cube.rotation.y += 0.01
    this._renderer.render(this._scene, this._camera)

    // Tell the browser to give us another frame.
    this._req = requestAnimationFrame(this._thisLoop)
  }
  
  /** Stop engine. */
  stop() {
    console.log('[Engine] Stopping... ')
    cancelAnimationFrame(this._req)
    this._scene = null
    this._renderer = null
    this._camera = null
  }
}

export default Engine;