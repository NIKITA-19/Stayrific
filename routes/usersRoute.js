const express = require('express');
const router = express.Router();
const User =require("../model/user")

router.post("/register",async(req,res) =>{

    const newuser = new User(req.body)
    try{
        const user = await newuser.save();
        res.send("User Registered Successfully")
    }catch(error){
        return res.status(400).json({error});
    }
});

router.post("/login",async(req,res) =>{

    const email=req.body.email;
    const password=req.body.password
    try{
        const user= await User.findOne({email : email, password : password});
        if(user){
            const secure= {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user._id
            }
            res.send(secure)
        }
        else{
            
            return res.status(400).json({error});
        }
    }catch(error){
        return res.status(400).json({error});
    }
});

router.get("/getallusers",async(req,res) =>{

    try{
        const users = await User.find();
        res.send(users)
    }catch(error){
        return res.status(400).json({error});
    }
});
module.exports=router;