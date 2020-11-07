const express=require('express')
const multer=require('multer')
const User=require('../models/user')
const router=express.Router()
const auth=require('../middleware/auth')
// const Sharp=require('sharp')

//-------file upload----------
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        // cb(new Error("File must be PDF"))<-reject
        // cb(undefined,true)<-accept
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/))
        {
            return cb(new Error("Please upload a jpeg or png image"))
        }
        cb(undefined,true);
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    
    req.user.avatar=req.file.buffer
    // const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    // req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        
        if(!user || !user.avatar)
            throw new Error("Not found")

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})
//---------------------------
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try {
        await user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
    
})

router.post('/user/login',async(req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.status(200).send({user,token})
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter(token=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/users/me',auth,async(req,res)=>{
    
      res.status(200).send(req.user)

})

router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowed_updates=['name','email','password','age']
    const isValidOperation=updates.every(update=>allowed_updates.includes(update))

    if(!isValidOperation)
    return res.status(400).send({error:"invalid update"})

    try {
        
        updates.forEach(update=>req.user[update]=req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try {
        await req.user.remove()
        
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports=router



