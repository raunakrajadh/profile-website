const express = require('express')
const app = express.Router()

let Auth = (req, res, next) => {
    if(req.session.username == 'raunakrajadh'){
        next()
    }
    else{
        res.redirect('/')
    }
}

app.get('/', Auth, (req, res) => {
    res.render('aastha/home')
})

app.get('/happy-birthday', Auth, (req, res) => {
    res.render('aastha/happy_birthday/index')
})

app.get('/discord', Auth, (req, res) => {
    res.render('aastha/home')
})

app.get('/discord/dm', Auth, (req, res) => {
    res.render('aastha/discord/dm')
})

app.get('/discord/server', Auth, (req, res) => {
    res.render('aastha/discord/server')
})

module.exports = app