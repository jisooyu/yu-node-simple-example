const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(userRouter)
app.use(blogRouter)

app.listen(port, ()=>{
    console.log("The server is running at " + port)
})
