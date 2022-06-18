const mongoose=require('mongoose');



const commentScema=mongoose.Schema({

    content:{
        type:String,
        required:true
    },
    commntCreator:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
   },
   Likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
   }],
   replayes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "replay"
   }],
   commentUploader:{},
   isLiked:Boolean,
   likesNum:String,
   uploadDate:String,
   sortDate:Date
   
});


  
module.exports=mongoose.model('Comment',commentScema);
module.exports.schema=commentScema;