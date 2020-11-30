const express=require("express");
const router=new express.Router();
const Teacher=require("../models/teacher");
const authentication=require("../utils/authentication");

//create teacher registration ...
router.post("/",async (req,res)=>{
   try {
    const teacher=new Teacher({
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        institution:req.body.institution,
        email:req.body.email,
        password:req.body.password,
    })
    await teacher.save();
    const token=await teacher.generateAuthToken();
    res.status(201).send({teacher:teacher,token});
} catch (error) {
     res.status(400).send(error);
   }
})
//login to teacher's profile...
router.post("/log_in",async (req,res)=>{
    try {
     const teacher=await Teacher.findByCredentials(req.body.email,req.body.password);
     if(!teacher){
         res.status(400).send("Invalid credentials");
     }
     const token=await teacher.generateAuthToken();
     res.status(200).send({teacher:teacher,token});
    } catch (error) {
      res.status(400).send(error);
    }
 })
 //logging out...
 router.post("/log_out",authentication,async (req,res)=>{
    try {
     req.teacher.tokens=req.teacher.tokens.filter((token)=>token.token!=req.token);
     await req.teacher.save();
     res.status(200).send();
    } catch (error) {
      res.status(500).send(error);
    }
 })
//get teacher details 
router.get("/me",authentication,async (req,res)=>{
    try {
    const teacher=req.teacher;
    res.status(200).send({teacher:teacher});
    } catch (error) {
     res.status(500).send(error);   
    }
})
//edit doctor details 
router.patch("/edit/me",authentication,async (req,res)=>{
  try {
    const updates=Object.keys(req.body);
    const allowedUpdates=["name","phoneNumber","institution","email","password"];
    const isValid=updates.every((update)=>allowedUpdates.includes(update));

    if(!isValid){
        res.status(400).send("Invalid Updates");   
    }
    const teacher=req.teacher;
    updates.forEach((update)=>teacher[update]=req.body[update]);
    await teacher.save();
    res.status(200).send(teacher);   
  } catch (error) {
    res.status(500).send(error);
  }
})
//delete teacher
router.delete("/me",authentication,async (req,res)=>{
    try {
      const teacher=req.teacher;
      await teacher.remove();
      res.status(200).send(teacher);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports=router;