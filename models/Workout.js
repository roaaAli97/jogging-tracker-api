const mongoose=require("mongoose")
const moment=require("moment")
const workout=mongoose.model("Workout",{
    date:{
        type:Date,
        default:Date.now,
        
    },
    distance:{
        type:Number
    },
    time:{
        type:Number
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})
module.exports=workout
