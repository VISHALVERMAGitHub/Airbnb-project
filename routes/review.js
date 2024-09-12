const express=require("express");
const router = express.Router({mergeParams:true});

const Listing =require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");

const Review =require("../models/review.js");
const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js")


// reviews ka post route
router.post("/",isloggedIn, validateReview , asyncWrap( async(req,res)=>{
    let listing=await Listing.findById({_id:req.params.id});
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id ;   // req.user is loggedin user
    // console.log(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created !")
    res.redirect(`/listings/${listing._id}`);

})
);

// delete review route

router.delete("/:reviewId",isloggedIn,isReviewAuthor,async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted !")
    res.redirect(`/listings/${id}`); 
})
router.get("/:reviewId",isloggedIn,isReviewAuthor,async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted !")
    res.redirect(`/listings/${id}`); 
})
module.exports=router;