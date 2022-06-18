const mongoose=require('mongoose');
const Comment=require('./comments');

const PostScema=mongoose.Schema({

    content:{  
        type:String,
        required:true 
    }, 
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    fileAttatched:[{
        type:String
    }],    
    timestemp:{ 
        type:String   
    }, 
    sortDate:Date,
   postCreator:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
   }, 
   Likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
   }],
   Level:String,
   likesNum:String,
   commentsNum:String,
   postUploader:{},
   mine:Boolean,
   isLiked:Boolean,
   postType:String,
   filePath:String,
});


  
module.exports=mongoose.model('Post',PostScema);
module.exports.schema=PostScema;   