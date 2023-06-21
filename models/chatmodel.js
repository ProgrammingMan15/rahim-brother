const mongoose=require("mongoose")

const Chatschema=new mongoose.Schema({
    sender_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        },
    message:{
        type:String,
        require:true
    }
},{timestamps:true});

module.exports=new mongoose.model("Mesages",Chatschema)