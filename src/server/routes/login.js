var express = require('express');
var router = express.Router();
var database = require('../../db/database.js')()

router.post('/login', (req, res) => {
    database.hello()
    database.db.collection('accounts').save(req.body, (err, result) => {
        if (err) return console.log(err)
            console.log('saved to database')
        res.redirect('/')
    })
})

module.exports = router;