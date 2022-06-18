const mongoose=require('mongoose');
const joi=require('joi');


const UserScame=mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    userMail:
    {
      type:String,
      required:true,
    }
});

module.exports=mongoose.model('User',UserScame);
