const { string } = require("joi");
const mongoose = require("mongoose");
// const Review=require("./review.js");

const Schema =mongoose.Schema ;
const listingSchema =new Schema({
    title:{
        type:String,
        required:true,
           
    },
    description:String,
    image :{
        url:String,
        filename:String,
        },
    price: Number,
    location:String,

    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }
})
const Listing = mongoose.model("Listing",listingSchema) ;
module.exports=Listing;