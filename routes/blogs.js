const express = require('express');
const Blog = require('./../models/blog')
const router = express.Router();

const Auth = (req, res, next) => {
    if(req.session.username == 'raunakrajadh'){
        next()
    }
    else{
        res.redirect('/')
    }
}

router.get('/new', Auth, (req, res) => {
    res.render('blogs/new', { req: req, blog: new Blog() })
})

router.get('/edit/:id', Auth, async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.render('blogs/edit', { req: req, blog: blog })
})

router.get('/:slug', async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if(blog == null) res.redirect('/')
    res.render('blogs/show', { req: req, blog : blog })
})

router.post('/', Auth, async (req, res, next) => {
    req.blog = new Blog()
    next()
}, saveBlogAndRedirect('new'))

router.put('/:id', Auth, async (req, res, next) => {
    req.blog = await Blog.findById(req.params.id)
    next()
}, saveBlogAndRedirect('edit'))

router.delete('/:id', Auth, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveBlogAndRedirect(path){
    return async (req, res) => {

        let blog = req.blog
        blog.title = req.body.title
        blog.description = req.body.description
        blog.markdown = req.body.markdown
    
        try{
            blog = await blog.save()
            res.redirect('/blogs/' + blog.slug)
        }
        catch(error){
            res.render('blogs/' + path , { req: req, blog: blog })
        }
    }
}

module.exports = router;