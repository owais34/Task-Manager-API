const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')


const userSchema=mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Enter valid email address")
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0)
            throw new Error("Age must be a positive number")
        }
    },
    password:{
        type: String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("password"))
                throw new Error("Password cannot contain string password")
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true
})

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({ _id: user._id.toString() },'thisismynewproject')

    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON =function(){
    const user=this
    const userObject=user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})

    if(!user)
    {
        throw new Error("Wrong login credentials")
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch)
    {
        throw new Error("Wrong login credentials")
    }

    return user
}


// hash plaintext password before using
userSchema.pre("save",async function(next){
    const user=this

    if(user.isModified("password")){
        user.password=await bcrypt.hash(user.password,8)
    }

    next() //next process in this case save
})

//delete user tasks when deleting user

userSchema.pre("remove",async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})


const User=mongoose.model('User',userSchema)


// const me=new User({
//     name:"owais",
//     age:22,
//     email:'OWAISHUNTER78@GMAIL.com',
//     password:'thehunter880'
// })

// me.save().then((result) => {
//     console.log(me)
// }).catch((err) => {
//     console.log(err)
// });


module.exports=User