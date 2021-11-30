const express = require('express')
const Blog = require('../models/blog')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/blogs', auth, async(req, res)=> {
    const blog = new Blog({
        ...req.body,
        postedBy: req.user._id
    })
    try {
        await blog.save()
        res.status(201).send({blog})
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports = router