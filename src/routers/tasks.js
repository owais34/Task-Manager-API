const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')

const router=express.Router()

router.post('/tasks',auth,async(req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(err)
    }
})

//GET /tasks?completed=true
// limit skip /tasks?completed=true&limit=10&skip=10
//GTE /tasks?sortBy=createdAt:asc
router.get('/tasks',auth,async(req,res)=>{
    try {
        const match={owner:req.user._id}
        const sort={}

        if(req.query.completed)
        {
           match.completed = req.query.completed==="true" 
        }

        if(req.query.sortBy)
        {
            const parts=req.query.sortBy.split(":")
        }
        sort[parts[0]]=(parts[1]==='desc')?-1:1;

        const tasks=await Task.find(match,null ,{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        })
        // or await req.user.populate('tasks').execPopulate()
        res.status(201).send(tasks)
    } catch (error) {
        res.status(404).send(err)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try {
        const task=await Task.findOne({
            _id,owner:req.user._id
        })

        if(!task)
        return res.status(404).send()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowed_updates=['completed']
    const isValidOperation=updates.every(update=>allowed_updates.includes(update))
    if(!isValidOperation)
    return res.status(400).send({error:"invalid update"})

    const _id=req.params.id
    try {
        const task=await Task.findById({_id,owner:req.user._id})
        
        if(!task)
        return res.status(404).send({error:'task not found'})

        updates.forEach(update=>task[update]=res.body[update])
        task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(404).send()
    }

})

router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try {
        const task=await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task)
        return res.status(404).send({error:"Not found task"})
    } catch (error) {
        res.status(500).send()
    }
})

module.exports=router