const mongoose = require('mongoose');

const EventSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    date:{
        type:Date,
        required:true
    },
    venue:{
        type:String,
    },
    mode:{
        type:String,
       enum:['online','offline'],
       default:'offline'
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        default:'Admin'
    }
},
{timestamps:true}
)

module.exports=mongoose.model('Event',EventSchema);