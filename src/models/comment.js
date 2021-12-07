const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    commentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
