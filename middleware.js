const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
module.exports.isloggedIn = (req, res, next) => {
    // console.log(req.user); // current logged in user info
    // console.log(req);
    console.log("vishal");
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);

    }
    next()
}

//schema validation as middleware
module.exports.validateListing = (req, res, next) => {
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
        // console.log(value);
        throw new ExpressError(400, error.details[0].message); // Properly handling validation errors
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // console.log(value);
        let errMsg = error.details.map((err) => err.message).join(",");
        // console.log(errMsg);
        throw new ExpressError(400, errMsg); // Properly handling validation errors
    }
    else {
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not author of review");
        return res.redirect(`/listings/${id}`);

    }
    next()
}