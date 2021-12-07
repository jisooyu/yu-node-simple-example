const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const router = new express.Router()
const Comment = require('../models/comment')

// create a blog
router.post('/posts', auth, async (req, res)=> {
    const post = new Post({
        ...req.body,
        postedBy: req.user._id
    })
    try {
        await post.save()
        res.status(201).send(post)
    } catch(e){
        res.status(400).send(e)
    }
})

// read all blog
router.get('/posts', auth, async (req, res) => {
    try {
        await req.user.populate( 'posts')
        res.send(req.user.posts)
    } catch (e) {
        res.status(500).send()
    }
})


// update a blog except the comment
router.patch('/posts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['title', 'content']
    const isValidOperation = updates.every ((update) => allowUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const post = await Post.findOne({
            _id: req.params.id, 
            postedBy: req.user._id
        })
        if(!post) {
            return res.status(404).send()
        }

        updates.forEach((update) => post[update] = req.body[update])
        await post.save()
        res.send(post)

    } catch (e) {
        res.status(500).send()
    }
})

// delete a post
router.delete('/posts/:id', auth, async (req, res)=>{
    try{
        const post = await Post.findOneAndDelete({_id:req.params.id, postedBy: req.user._id})

        if(!post){
            return res.status(404).send()
        }
        res.send(post)
    } catch (e){
        res.status(500).send()
    }
})

// add a comment
router.post('/posts/comment/:id', auth, async(req, res)=>{
    const post = await Post.findOne({
        _id: req.params.id
        // postedBy: req.user._id
    })
    if(!post) {
        return res.status(404).send()
    }
    const comment = new Comment ({
        ...req.body
    })
    
    try{
        post.comments = post.comments.concat({comment})
        await post.save()
        res.status(201).send(comment)
    } catch (e){
        res.status(500).send()
    }
})

// delete a post
router.delete('/posts/:postId/:commentId', auth, async (req, res)=> {
    // 특정 post로 가서 그곳의 comments array에 특정 comment를 delete
    try {
        const comment = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $pull: {
                    comments:{ $in: [req.params.commentId] }
                }
            },
            { 'new': true }
        )
        console.log(comment)
        console.log(req.params.commentId)
        if (!post){
            return res.status(404).send("Post not found")
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router