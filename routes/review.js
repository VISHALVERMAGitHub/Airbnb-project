const express=require("express");
const router = express.Router({mergeParams:true});
const asyncWrap = require("../utils/asyncWrap.js");

const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review.js");


// reviews ka post route
router.post("/",isloggedIn, validateReview , asyncWrap( reviewController.createReview)
);

// delete review route

router.delete("/:reviewId",isloggedIn,isReviewAuthor,reviewController.destroyReview)

// router.get("/:reviewId",isloggedIn,isReviewAuthor,reviewController.getRequestDeletionReviewBeforeLogin)

module.exports=router;