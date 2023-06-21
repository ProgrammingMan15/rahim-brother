const signupmodel=require("../models/singup")
const signup=(req,res)=>{
    try{
        res.render("signup")
    }catch(err){
        console.log(err.name)
    }
}
const login=(req,res)=>{
    try{
        res.render("signin")
    }catch(err){
        console.log(err.name)
    }
}
const dashboard=async(req,res)=>{
    try{
        const UserDat=await signupmodel.find({_id:{$nin:[req.session.user_id]}});
        res.render("home",{user:req.session.user_id,data:UserDat})
    }catch(err){
        console.log(err.name)
    }
}
const logout=async(req,res)=>{
    try{
       req.session.destroy();
       res.redirect("/")
    }catch(err){
        console.log(err)
    }
};
// const signuppost=(req,res)=>{
//     try{
//         const Usersave=new signupmodel({
//             name:req.body.name,
//             email:req.body.email,
//             password:req.body.password,
//             user_photo:req.file.filename
//         })
//     }catch(err){
//         console.log(err.name)
//     }
// }
module.exports={signup,login,dashboard,logout}