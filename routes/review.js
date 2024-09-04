const express=require("express");
const router = express.Router({mergeParams:true});

const Listing =require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const Review =require("../models/review.js");

// validateReview schema as server side validations by joi 
const validateReview =(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        // console.log(value);
        let errMsg =error.details.map((err)=>err.message).join(",");
        // console.log(errMsg);
        throw new ExpressError(400, errMsg); // Properly handling validation errors
    }
    else{
        next();
    }
}

// reviews ka post route
router.post("/", validateReview , asyncWrap( async(req,res)=>{
    let listing=await Listing.findById({_id:req.params.id});
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);

})
);

// delete review route

router.delete("/:reviewId",async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})

module.exports=router;