const express = require('express')
const app = express.Router()
const User = require('../models/user')

const LoginAuth = (req, res, next) => {
    if(req.session.isAuth){
        res.redirect('/')
    }
    else{
        next()
    }
}

app.get('/login', LoginAuth, (req, res) => {
    res.render('./login/login', {req: req, status: ''})
})

app.post('/login', async (req, res) => {

    let loginUserArray = await User.find()
    let matchEmailLoginUser = loginUserArray.find((user) => user.email.toUpperCase() == req.body.email.toUpperCase())
    let matchEmailPasswordLoginUser = loginUserArray.find((user) => user.email.toUpperCase() == req.body.email.toUpperCase() && user.password == req.body.password)

    if(!matchEmailLoginUser){
        res.render('./login/login', {req: req, status: 'Incorrect credentials!'}) 
    }
    else{

        if(!matchEmailPasswordLoginUser){
            res.render('./login/login', {req: req, status: 'Incorrect credentials!'})
        }
        else{
            saveLoginData(req, res)
        }
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/')
    })
})

async function saveLoginData(req, res){

    async function saveLoginCred(){
        let loginUserArray = await User.find()
        let matchLoginUser = loginUserArray.find((user) => user.email.toUpperCase() == req.body.email.toUpperCase())
        req.session.isAuth = true,
        req.session.username = matchLoginUser.username
        req.session.email = matchLoginUser.email
        req.session.password = matchLoginUser.password
    }
    await saveLoginCred()
    .then(() => {
        res.redirect('/')
    })
}
module.exports = app