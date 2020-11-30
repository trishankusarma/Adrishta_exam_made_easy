const express=require("express");
const router=new express.Router();
const Classroom=require("../models/classRoom");
const authentication=require("../utils/authentication");

//create classroom
router.post("/",authentication,async (req,res)=>{
   try {
    const classroom=new Classroom({
      ...req.body,
      teacher:req.teacher._id
    });
    await classroom.save();
    res.status(201).send(classroom);
} catch (error) {
     res.status(400).send(error);
   }
})
//get all classroom details
router.get("/",authentication,async (req,res)=>{
  try {
  await req.teacher.populate('classroom').execPopulate();
  const classrooms=req.teacher.classroom.sort({createdAt:'desc'});
  if(!classrooms){
      res.status(400).send("No classroom to show");
  }
  res.status(200).send(classrooms);
  } catch (error) {
   res.status(500).send(error);   
  }
})
//get specific classroom detail for teacher to see
router.get("/:_id",authentication,async (req,res)=>{
    try {
    const _id=req.params._id;
    const classroom=await Classroom.findById(_id);
    if(!classroom){
        res.status(400).send("Invalid Id");
    }
    await classroom.populate('exam').execPopulate();
    res.status(200).send(classroom);
    } catch (error) {
     res.status(500).send(error);   
    }
})

//edit basic details of classroom
router.patch("/edit/:_id",authentication,async (req,res)=>{
  try {
    const updates=Object.keys(req.body);
    const allowedUpdates=["name","strength","examno","lastexam"];
    const isValid=updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        res.status(400).send("Invalid Updates");   
    }
    const _id=req.params._id;
    const classroom=await Classroom.findById(_id);
    if(!classroom){
        res.status(400).send("Invalid Id");
    }
    updates.forEach((update)=>classroom[update]=req.body[update]);
    await classroom.save();
    res.status(200).send(classroom);   
  } catch (error) {
    res.status(500).send(error);
  }
})
//delete classroom
router.delete("/:_id",authentication,async (req,res)=>{
    try {
      const _id=req.params._id;
      const classroom=await Classroom.findById(_id);
      if(!classroom){
        res.status(400).send("Invalid Id");
     }
      await classroom.remove();
      res.status(200).send(classroom);
    } catch (error) {
      res.status(500).send(error);
    }
})

module.exports=router;