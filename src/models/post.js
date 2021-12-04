const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comments: [{
        comment: {
            type: String
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post