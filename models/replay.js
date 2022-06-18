const mongoose=require('mongoose');



const replayScema=mongoose.Schema({

    content:{
        type:String,
        required:true
    },
    replayCreator:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
   },
   Likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
   }],
   replayUploader:{},
   likesNum:String,
   isLiked:Boolean
   
});


  
module.exports=mongoose.model('replay',replayScema);
module.exports.schema=replayScema;