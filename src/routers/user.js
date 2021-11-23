const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// create users
router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({user})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req, res)=>{
    
})

router.get('/users', async (req, res)=> {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router