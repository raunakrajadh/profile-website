const express = require('express')
const app = express.Router()

const Auth = (req, res, next) => {
    if(req.session.username == 'raunakrajadh'){
        next()
    }
    else{
        res.redirect('/')
    }
}

app.get('/', Auth, (req, res) => {
    res.sendStatus(404)
})

module.exports = app