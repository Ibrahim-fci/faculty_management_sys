const mongoose=require('mongoose');
const Enum =require("enum")



const eventsScema=mongoose.Schema({

    title:{
        type:String,
    },
    Description:{
        type:String,
    },
    image:{
        type:String
    },
    eventCreator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin"
    },
    uploadDate:String,
    sortDate:Date,
    day:String
    
});


  
module.exports=mongoose.model('event',eventsScema);