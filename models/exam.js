const mongoose=require("mongoose");

const examSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    date:{
       type:Date,
       required:true,
       default:Date.now()
    },
    timeLength: [{
        hours: {
            type: Number, required: true, min: 0, max: 23
        },
        minutes: {
            type: Number, required: true, min: 0, max: 59
        },
        seconds: {
            type: Number, required: true, min: 0, max: 59
        }
    }],
    classroom:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Classroom'
    }
},{ timestamps:true })

const Exam=mongoose.model('Exam',examSchema);
mongoose.exports=Exam;