const mongoose=require("mongoose")

const UserSignup=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    user_photo:{
        type:String,
        require:true
    },
    is_online:{
        type:Number,
        default:0
    }
},{timestamps:true})
module.exports=new mongoose.model("UserData",UserSignup)