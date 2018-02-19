// @ts-check
const express = require('express')
const router = express.Router()
const path = require('path')

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
