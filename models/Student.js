const mongoose=require('mongoose');
const Post=require('./post');


const StudentScema=mongoose.Schema({

    Name: {
        type: String,
        required: true
      },
      Email: {
        type: String,
        required: true,
        unique: true
      },
      Password: {
        type: String,
        required: true
      },
    
     
      Department: {
        type: String,
        
      },
      Dof: {
        type: String,
        required: true
      },
      ProfileImagePath: {
        type: String,
        required: false
      },
      posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post"
        }
      ],
      grade: {
        type: String,
        require
      },
      Likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }],
      quizes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "quiz"
        }
      ],
      city: {
        type: String
      },
      Address: {
        type: String
      },
      Gender: {
        type: String
      },
     level:String,
     bio:String,
     isDisabled:Boolean,
     contacts:[{
         type:String
       }
     ],
     lastMessage:{},
     mailedKey: {
      type: String
    }
});

  
module.exports=mongoose.model('Student',StudentScema);
module.exports.schema=StudentScema;