const express = require('express')
const app = express.Router()

app.get('/github', (req, res) => {
    res.redirect('https://github.com/raunakrajadh')
})

app.get('/instagram', (req, res) => {
    res.redirect('https://instagram.com/raunakrajadh')
})

app.get('/twitter', (req, res) => {
    res.redirect('https://twitter.com/raunakrajadh')
})

app.get('/letbyte', (req, res) => {
    res.redirect('https://letbyte.app')
})

module.exports = app
