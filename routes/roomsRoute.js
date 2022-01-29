const express= require("express");
const router =express.Router();

const Rooom= require('../model/room')
router.get("/getallrooms", async(req,res)=>{
    try{
        const rooms= await Rooom.find({});
        return res.send({rooms});
    }
    catch(error){
       return res.status(400).json({message: error});
    }
});
router.post("/getroombyid", async(req,res)=>{
    const _id= req.body.roomid;
    try{
        const room= await Rooom.findOne({_id:_id});
        return res.send({room});
    }
    catch(error){
       return res.status(400).json({message: error});
    }
});

router.post("/addroom", async(req,res)=>{
    try{
        const newroom= new Rooom(req.body);
        await newroom.save()
        return res.send('New room added successfully');
    }
    catch(error){
       return res.status(400).json({message: error});
    }
});

module.exports =router;