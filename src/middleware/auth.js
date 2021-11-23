const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization')
        console.log(token)
    } catch (e){
        res.status(401).send({error: "Please authenticate."})
    }
}

module.exports = auth