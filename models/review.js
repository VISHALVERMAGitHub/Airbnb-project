const { ref } = require("joi");
const mongoose = require("mongoose");

const Schema =mongoose.Schema ;
const reviewSchema =new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    created:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports=mongoose.model("Review",reviewSchema);