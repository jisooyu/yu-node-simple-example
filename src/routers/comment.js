const express = require('express')
const Comment = require('../models/comment')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const router = new express.Router()


// post a comment to the post with the post id
router.post('/comment/:postId', auth, async(req, res)=>{
    const comment = new Comment({
        ...req.body,
        commentedBy: req.user._id
    })
    try {
        const post = await Post.findOne({
            _id: req.params.postId
        })

        if(!post){
            return res.status(404).send()
        }
        
        post.comments = post.comments.concat(comment._id)

        await post.save()
        await comment.save()

        res.status(201).send(comment)
    } catch (e){
        res.status(400).send(e)
    }
})

// display all comments for a post 
router.get("/comment/:postId", auth, async (req, res)=>{
    try{
        // find a post
        const post = await Post.findOne({_id:req.params.postId, postedBy: req.user._id})
        if(!post){
            return res.status(404).send()
        }

        // comments Id in a post
        const comments = post.comments
        // define an empty array
        const commentArray = []
        // find the comment from Comment using comment id in the post
        for (let comment of comments) {
           const foundComment = await Comment.findOne({_id: comment})
           // push the found comment from Comment into commentArray
           commentArray.push(foundComment)
        }
        res.send(commentArray)
    } catch (e) {
        res.status(500).send()
    }
})

// delete the comment with the post id and the comment id
router.delete("/comment/:postId/:commentId", auth, async (req, res)=>{
    try {
        const post = await Post.findByIdAndUpdate (
            req.params.postId,
            { 
                $pull: { comments: req.params.commentId },
            },
            { new: true }
        )

        if (!post){
            return res.status(400).send("Post not found")
        }

        const comment = await Comment.findByIdAndDelete(req.params.commentId)
        if(!comment){
            return res.status(404).send()
        }
        res.send(comment)

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router