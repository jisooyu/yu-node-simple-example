const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim: true
    },
    content: {
        type:String,
        required: true,
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[{
        type:String,
        postedBy:{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User'
        }
    }

    ]
})

const User = mongoose.model('Blog', blogSchema)
module.exports = User