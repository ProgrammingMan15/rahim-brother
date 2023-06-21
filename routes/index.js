const express=require("express")
const route=express()
const mainfile=require("../controllers/mainfile")
const mongoose=require("mongoose")
const signupmodel=require("../models/singup")
const multer=require("multer")
const bodyparser=require("body-parser")
const bcrypt=require("bcrypt")
const session=require("express-session")
const midlle=require("../middleware/controll")
const chat=require("../models/chatmodel")
mongoose.connect("mongodb+srv://shihabmoni15:ELeAQCjLzTLTYvAu@nodepro.yfnlrkq.mongodb.net/?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(()=>{
    console.log("okk")
}).catch((err)=>{
    console.log(err)
});
route.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}))
route.use(bodyparser.json())
route.use(bodyparser.urlencoded({extended:true}))
route.use(express.static("public"))
route.set("view engine","ejs")
const storeimg=multer.diskStorage({
    destination:function(req,file,cb){
    var filedes="./public/userimage";
    cb(null,filedes)
    },
    filename:function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null,uniqueSuffix)
    }
})
const upload=multer({storage:storeimg})
route.get("/",midlle.islogout,mainfile.signup)
const passwo=async (pass)=>{
    const passhash=await bcrypt.hash(pass,10);
    return passhash
}
route.post("/signup",upload.single("userimage"),async(req,res)=>{
    try{
             const sendpass=await passwo(req.body.password);
       
        const Usersave= new signupmodel({
            name:req.body.name,
            email:req.body.email,
            password:sendpass,
            user_photo:req.file.filename
        });
        Usersave.save();
        res.redirect("/signin")
    }catch(err){
        console.log(err.name)
    }
})

route.get("/signup",midlle.islogout,mainfile.signup)
route.get("/signin",midlle.islogout,mainfile.login)
route.get("/dashboard",midlle.islogin,mainfile.dashboard)
route.get("/dashboard/logout",midlle.islogin,mainfile.logout)
route.get("*",(req,res)=>{
    res.send("helloo")
})
route.post("/signin",async(req,res)=>{
    try{
        const email=req.body.email;
        const name=req.body.name;
        const usergatdata=await signupmodel.findOne({email:email});
        if(usergatdata){
            if(usergatdata.name==name){
                req.session.user_id=usergatdata;
                res.redirect("/dashboard")
            }else{
            res.render("signin",{message:"Please,Properly Fill Up Your Information"})
       }
       }else{
            res.render("signin",{message:"Please,Properly Fill Up Your Information"})
       }
    }catch(err){
        console.log(err.name)
    }
})
route.post("/save-userchat",async(req,res)=>{
        try{
               var chat_user=new chat({
                sender_id:req.body.sender_id,
                reciever_id:req.body.reciever_id,
                message:req.body.message
               });
              var sa_user=await chat_user.save();
              res.send({success:true,data:sa_user})
        }catch(err){
            console.log(err)
        }
});
module.exports=route