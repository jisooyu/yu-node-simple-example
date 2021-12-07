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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

// establish the virtual link with posts
// postSchema.virtual('comments', {
//     ref: 'Comment',
//     localField: '_id',
//     foreignField: 'commentedBy'
// })


const Post = mongoose.model('Post', postSchema)

module.exports = Post