const mongoose=require('mongoose');
const Result=require("./quizResult");



const quizSchema=mongoose.Schema({

  
questions:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:'Quesion'
}],
Title:String,
QuizCreator:{             // must be a doctor
 type:mongoose.Schema.Types.ObjectId,
 ref:'doctor'
},    
StudentDone:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:'result'
}],       
Level:{
 type:String,
 required:true
},
quizUploader:{},
isPuplished:Boolean,
isTaked:Boolean,
QuestionNum:String,
uploadDate:String,
sortDate:Date,
StudentTakedExam:[]

})




module.exports=mongoose.model("quiz",quizSchema);