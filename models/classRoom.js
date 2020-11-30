const mongoose=require("mongoose");
const Exam=require("./exam");

const classroomSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    strength:{
        type:Number,
        required:true,
        trim:true,
        validate(value){
            if(value<0){
                throw new Error("Invalid Strength");
            }
        }
    },
    examno:{
       type:Number,
       required:true,
       default:0,
       trim:true
    },
    lastexam:{
      type:Date,
      required:true,
      trim:true,
      default:NaN
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Teacher'
    }
},{ timestamps:true })

classroomSchema.pre('remove',async function(next){
    const classroom=this;
    await Exam.deleteMany({classroom:classroom._id});
    next();
})

classroomSchema.virtual('exam',{
    ref:'Exam',
    localField:'_id',
    foreignField:'classroom'
})

const Classroom=mongoose.model('Classroom',classroomSchema);
mongoose.exports=Classroom;