const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const commentRouter = require('./routers/comment')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)

app.listen(port, ()=>{
    console.log("The server is running at " + port)
})
