const express=require("express");
const app=express();
const mongoose=require("mongoose");
const teacherRouter=require("./routers/teacher");
const examRouter=require("./routers/exam");
const classRoomRouter=require("./routers/classroom");
const studentRouter=require("./routers/student");
require("dotenv").config();

const PORT=process.env.PORT;

app.use(express.urlencoded({extended:false}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
})
const db=mongoose.connection;
db.on("error",(error)=>{
    console.error(error);
})
db.once("open",()=>{
    console.log("Connected to MongoDB database");
})

app.use("/teacher",teacherRouter);
app.use("/student",studentRouter);
app.use("/exam",examRouter);
app.use("/classRoom",classRoomRouter);

app.listen(PORT,()=>{
    console.log(`Port running at ${PORT}`);
})