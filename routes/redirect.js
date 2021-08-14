const express = require('express')
const app = express.Router()

app.get('/github', (req, res) => {
    res.redirect('https://github.com/raunakrajadh')
})

app.get('/discord', (req, res) => {
    res.redirect('https://discord.gg/Rgj6e8Tuq5')
})

app.get('/instagram', (req, res) => {
    res.redirect('https://instagram.com/raunakrajadh')
})

app.get('/twitter', (req, res) => {
    res.redirect('https://twitter.com/raunakrajadh')
})

app.get('/mydyno', (req, res) => {
    res.redirect('http://mydyno.tk')
})

app.get('/mydyno-discord', (req, res) => {
    res.redirect('https://mydyno.netlify.app')
})

module.exports = app