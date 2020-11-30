const jwt=require("jsonwebtoken");
const Teacher=require("../models/teacher");

const auth=async (req,res,next)=>{
    try{
      const token=req.header('Authorization').replace("Bearer ","");
      const decoded=await jwt.verify(token,process.env.TOKEN);
      const teacher=await Teacher.findOne({_id:decoded._id,'tokens.token':token});
      if(!teacher){
        res.status(400).send("Authenticate as a teacher to proceed furthur!!");
      }
      req.teacher=teacher;
      req.token=token;
      next();
    }
    catch(error){
     res.status(500).send(error);
    }
}
module.exports=auth;
