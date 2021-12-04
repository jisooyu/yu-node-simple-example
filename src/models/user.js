const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Post = require('./post')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is not valid.")
            }
        }
    },
    password:{
        type:String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Password can not contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// establish the virtual link with posts
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'postedBy'
})

// hide secrets
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
 
    delete userObject.password
    delete userObject.tokens
    return userObject
 }

 // generate token
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat ({ token })
    await user.save()
    return token
}

// check the credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('로그인 할 수가 없습니다.')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error ('로그인 할 수가 없습니다.')
    } 

    return user
}

// hash the password
userSchema.pre('save', async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete blogs when the user is deleted
userSchema.pre('remove', async function (next){
    const user = this
    await Post.deleteMany({postedBy: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User