// @ts-check
const express = require('express')
const router = express.Router()
const database = require('../../db/database')

router.post('/login', (req, res) => {
    database.hello()
    database.getDB().collection('accounts').save(req.body, (err, result) => {
        if (err) return console.log(err)
            console.log('saved to database')
        res.redirect('/')
    })
})

module.exports = router