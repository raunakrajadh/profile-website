const express = require('express')
const app = express()
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const methodOverride = require('method-override');

const config = require('./config.json')
const blog = require('./models/blog');

const userRouter = require('./routes/user')
const blogRouter = require('./routes/blogs');

mongoose.connect(config.mongodb_url)
.then(() => {console.log('Connected to mongoose!')})
.catch((err) => {console.log('Couldn\'t connet to mongoose! Error: ' + err)})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use('/assets', express.static('assets'))
let store = new MongoDBSession({uri: config.mongodb_url, collection: 'loginSessions'})
app.use(session({secret: '_secret', resave: false, saveUninitialized: false, store: store}))

app.use('/user', userRouter)
app.use('/blogs', blogRouter)

app.get('/', async (req, res) => {
    const blogs = await blog.find().sort({ createdAt: 'desc'})
    res.render('index', {req: req, blogs: blogs})
})

let port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Listening at port: ' + port)
})