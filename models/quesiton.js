const mongoose=require('mongoose');


const questionSchema=mongoose.Schema({

    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true,
        enum:["1","2","3","4"]

    },
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    
});




module.exports=mongoose.model("Quesion",questionSchema);
module.exports.schema=questionSchema;
