const express = require('express')
const app = express.Router()
const User = require('../models/user')
const config = require('../config.json')
const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmailUser,
        pass: config.gmailPass
    }
});

const LoginRegisterAuth = (req, res, next) => {
    if(req.session.isAuth){
        res.redirect('/')
    }
    else{
        next()
    }
}

app.get('/login', LoginRegisterAuth, (req, res) => {
    res.render('./login/login', {req: req, status: 'Not Registered? <a href="/user/register">Register Now!</a>'})
})

app.get('/register', LoginRegisterAuth, (req, res) => {
    res.render('./register/register', {req: req, status: 'Already have an account? <a href="/user/login">Login Now!</a>'})
})

app.post('/login', async (req, res) => {

    let loginUserArray = await User.find()
    let matchEmailLoginUser = loginUserArray.find((user) => user.email.toUpperCase() == req.body.email.toUpperCase())
    let matchEmailPasswordLoginUser = loginUserArray.find((user) => user.email.toUpperCase() == req.body.email.toUpperCase() && user.password == req.body.password)

    if(!matchEmailLoginUser){
        res.render('./login/login', {req: req, status: 'Email not found!, please try again!<br>Not Registered? <a href="/user/register">Register Now!</a>'}) 
    }
    else{

        if(!matchEmailPasswordLoginUser){
            res.render('./login/login', {req: req, status: 'Wrong password!, please try again!<br>Not Registered? <a href="/user/register">Register Now!</a>'})
        }
        else{
            saveLoginData(req, res)
        }
    }
})

app.post('/register', async (req, res) => {

    let registerUserArray = await User.find()
    let matchEmailRegisterUser = registerUserArray.find((user) => user.email.toUpperCase() == req.body.email.toUpperCase())
    let matchUsernameRegisterUser = registerUserArray.find((user) => user.username.toUpperCase() == req.body.username.toUpperCase())

    if(matchEmailRegisterUser){
        res.render('./register/register', {req: req, status: 'That email is already taken!, please try again with a unique email!<br>Already have an account? <a href="/user/login">Login Now!</a>'})
    }
    else{

        if(matchUsernameRegisterUser){
            res.render('./register/register', {req: req, status: 'That username is already taken!, please try again with a unique username!<br>Already have an account? <a href="/user/login">Login Now!</a>'})
        }
        else{
            registerNext(req, res)
        }

    }
})

app.post('/verify', (req, res) => {

    if(req.body.verificationCode == req.session.verificationCode){
        saveData(req, res)
    }
    else{
        res.render('./verify/verify', {req: req, status: 'Code not matched!<br>Already have an account? <a href="/user/login">Login Now!</a>'})
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/')
    })
})

app.post('/deleteAccount', async (req, res) => {
    let userEmail = await req.session.email
    await User.deleteOne({email: userEmail})
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
    res.redirect('/')
}

async function saveData(req, res){

    let userData = new User({
        username: req.session.username,
        email: req.session.email,
        password: req.session.password,
    })
    await userData.save()
    res.redirect('/user/login')
}

function registerNext(req, res){
    let randomCode = Math.floor(Math.random() * 999999) + 111111;

    let mailOptions = {
        from: 'raunakrajadh@gmail.com',
        to: req.body.email,
        subject: 'Email Verification',
        html: 
`
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
        <td bgcolor="#c2dbe6" align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#c2dbe6" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Thank you for registering!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">This email was sent to verify your account, your verification code:</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B">
                                                <a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">
                                                    ${randomCode}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Thanks,<br>Raunak Raj</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`
    };

    transporter.sendMail(mailOptions, (error, data) => {

        if(error){ 
            res.render('./register/register', {req: req, status: 'Couldn\'t send verification email!, please try again!<br>Already have an account? <a href="/user/login">Login Now!</a>'})
            console.log('Error: ' + error)
        }
        else{

            req.session.verificationCode = randomCode;
            req.session.username = req.body.username
            req.session.email = req.body.email
            req.session.password = req.body.password
            res.render('./verify/verify', {req: req, status: 'A verification code has been sent to your email!<br>Already have an account? <a href="/user/login">Login Now!</a>'})
        }
    })
}

module.exports = app