const mongoose=require('mongoose');


const quizResultSchema=mongoose.Schema({

studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Student'
},
Result:String,
student:{}
});




module.exports=mongoose.model("result",quizResultSchema);
module.exports.schema=quizResultSchema;