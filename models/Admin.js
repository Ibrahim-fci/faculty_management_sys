const mongoose=require('mongoose');


const adminScema=mongoose.Schema({

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
    events:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"event"
    }],
    ProfileImagePath:{
        type:String
    },
    isadmin:Boolean,
    contacts:[{
        type:String
      }
    ],
    lastMessage:{}
});


  
module.exports=mongoose.model('admin',adminScema);