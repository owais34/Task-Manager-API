const express=require('express')
require('./db/mongoose')

const userRouter=require('./routers/user')
const taskRouter=require('./routers/tasks')


const app=express()
const PORT=process.env.PORT || 3000


app.use(express.json())//for json response 
app.use(userRouter)
app.use(taskRouter)

//without middleware new request->run route handler

// with middleware new request->do something ->route handler


app.listen(PORT,()=>{
    console.log("Server up and running")
})
