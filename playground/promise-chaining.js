require('../src/db/mongoose')

const User=require('../src/models/user')

//5f6b684e99871011becb51a4


const updateAgeAndCount= async (id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age})
    console.log(user)
    const count=await User.countDocuments({age})
    return count;
}

updateAgeAndCount('5f6b684e99871011becb51a4',22).then((count)=>{
    console.log(count)
})
.catch(err=>{
    console.log(err)
})