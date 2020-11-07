const jwt=require('jsonwebtoken')
const User=require('../models/user')


const auth=async (req,res,next)=>{
    try{
        
        const token=req.headers['authorization'].replace('Bearer ','')
        const decoded=jwt.verify(token,'thisismynewproject')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user)
        throw new Error()
        req.user=user
        req.token=token
        next()
    }
    catch(e){
        res.status(401).send({error:'please authenticate'})
    }
} 

module.exports=auth

