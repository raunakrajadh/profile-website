const express = require('express')
const app = express.Router()
const ShortUrl = require('../models/shorturl')

const Auth = (req, res, next) => {
    if(req.session.username == 'raunakrajadh'){
        next()
    }
    else{
        res.redirect('/')
    }
}

app.get('/', Auth, async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('./shorturl/shorturl', { req: req, res: res, shortUrls: shortUrls })
})

app.post('/shortUrls', Auth, async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    .then(() => {
        res.redirect('/shorturl')
    })
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
})

app.delete('/:shortUrl', Auth, async (req, res) => {
    await ShortUrl.deleteOne({ short: req.params.shortUrl })
    res.redirect('/shorturl')
})

module.exports = app