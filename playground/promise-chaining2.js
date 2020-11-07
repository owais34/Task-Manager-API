require('../src/db/mongoose')

const Task=require('../src/models/task')

// Task.findByIdAndDelete('5f6b65d42c82a97c0a45e408').then((result)=>{
//     console.log(result)
//     return Task.countDocuments({completed:false})
// })
// .then((result)=>{
//     console.log(result)
// })
// .catch(err=>{
//     console.log(err)
// })

const deleteIdCount= async (id)=>{
    const task= await Task.findByIdAndDelete(id)
    console.log(task)
    const count=await Task.countDocuments({completed:false})
    return count
}

deleteIdCount('5f6b65d42c82a97c0a45e408').then((result)=>{
    console.log(result)
})
.catch(err=>console.log(err))