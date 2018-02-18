let express = require('express')
let router = express.Router()
let path = require('path')

/* GET home page. */
router.get('/', function (req, res) {
  res.sendFile( path.join ( __dirname, '../../../dist', 'index.html') )
})

// router.get('/bundle.js', function (req, res) {
//   res.sendFile( path.join( __dirname, '../../../dist', 'bundle.js' ) )
// })

router.get('/test', (req, res) => {
  res.send("You are a test")
})

module.exports = router
