const mongoose=require('mongoose');


const messageScema=mongoose.Schema({

    content:{  
        type:String,
        required:true 
    }, 
    images:[{
        type:String
    }],    
    timestemp:{ 
        type:String   
    }, 
    
   sender:{ 
        type:String
   }, 
   reciver:{ 
    type:String
    },  
   sortDate:Date,
   sender1:{},
   reciver1:{},
   messageType:String,
   read:Boolean
});


  
module.exports=mongoose.model('message',messageScema);
module.exports.schema=messageScema;   