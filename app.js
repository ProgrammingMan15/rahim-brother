const app=require("express")()
const http=require("http").Server(app)
const io=require("socket.io")(http)
const port=process.env.PORT || 3000
const route=require("./routes/index")
const user=require("./models/singup")
const chat=require("./models/chatmodel")
app.use(route)
const usp=io.of("/enjoy-chat")
usp.on("connection",async(socket)=>{
    var user_id=socket.handshake.auth.token;
    await user.findByIdAndUpdate({_id:user_id},{$set:{is_online:'1'}});
    socket.broadcast.emit("getonline",{user:user_id});
    socket.on("disconnect",async()=>{
        var user_id=socket.handshake.auth.token;
        await user.findByIdAndUpdate({_id:user_id},{$set:{is_online:'0'}});
        socket.broadcast.emit("getofline",{user:user_id})
    });
    // chating send to the friend
    socket.on("chtsend",function(data){
        socket.broadcast.emit("loadchat",data)
    });
    socket.on("existchat",async function(data){
     var chats= await chat.find({$or:[
        {sender_id:data.sender_id,reciever_id:data.reciever_id},
        {sender_id:data.reciever_id,reciever_id:data.sender_id}
       ]});
       socket.emit("loadchats",{chats:chats})
    });
})
http.listen(port,(()=>{
    console.log("ok")
}))