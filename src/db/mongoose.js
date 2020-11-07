const mongoose=require('mongoose')
const validator=require('validator')

mongoose.connect('mongodb+srv://andrew:Andrew880!@cluster0.vbn87.mongodb.net/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})
console.log("Connected db")

