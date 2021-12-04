const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({

    comment: {
        type: String,
        trim: true,
        required: true
    }
})


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment