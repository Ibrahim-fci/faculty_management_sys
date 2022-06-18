const mongoose=require('mongoose');



const doctorScema=mongoose.Schema({

    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
      type:String,
      required:true
    },
    city:{
        type:String,
    },
    Address:{
        type:String
    },
    courses:[String],
    quizes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"quiz"
    }],
    title:{
        type:String,
        required:true
    },
    materials:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"material"
    }],
    Dof:{
        type:String,
        required:true
    },
    ProfileImagePath:{
        type:String
    },Gender:{
        type:String
    },
    posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post"
        }
    ],
    quizes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "quiz"
        }
    ],
    Likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }],
      bio:String,
      contacts:[{
          type:String
        }
      ],
      lastMessage:{},
      mailedKey: {
        type: String
      }
});


  
module.exports=mongoose.model('doctor',doctorScema);