const express = require('express')
const app = express.Router()

let loginUserArray = {
    username: "raunakrajadh",
    password: "Iamraunak@123"
}

const LoginAuth = (req, res, next) => {
    if(req.session.username == loginUserArray.username){
        res.redirect('/')
    }
    else{
        next()
    }
}

app.get('/', (req, res) => {
    res.redirect('/login')
})
app.get('/login', LoginAuth, (req, res) => {
    res.render('./login', {req: req, status: ''})
})

app.post('/login', async (req, res) => {
    if(req.body.username != loginUserArray.username || req.body.password != loginUserArray.password){
        res.render('./login', {req: req, status: 'Incorrect credentials!'})
    }
    else{
        req.session.username = req.body.username
        setTimeout(() => {res.redirect('/')},1000)
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        setTimeout(() => {res.redirect('/')},1000)
    })
})
module.exports = app