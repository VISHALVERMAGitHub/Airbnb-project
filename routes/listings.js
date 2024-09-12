const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");

const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
//schema validation as middleware


// index route
router.get("/", async (req, res) => {
    let all_listing = await Listing.find({});
    res.render("listings/index.ejs", { all_listing });
});


// new get route
router.get("/new", isloggedIn, (req, res) => {
    // res.send("success");
    res.render("listings/new.ejs");
})

// create new listing route
router.post("/", isloggedIn, validateListing, asyncWrap(async (req, res) => {

    //1a method
    // console.log(req.body);

    let { title, description, price, location, country } = req.body;
    // console.log(title);
    let list = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        owner: req.user._id,
    });
    (await list).save();
    // console.log(list);

    // 1b method
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // let listing =req.body.listing ;
    // await new Listing(listing).save();
    // console.log(listing);
    req.flash("success", "New listing Created!")
    res.redirect("/listings");
})
);

// show route
router.get("/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews" , populate:{path:"author"}}).populate("owner");
    if (!listing) {
        // next();// it is write by me and error  is show by better approach :it's show by flash
        req.flash("error", "Your requested listing does not existing")
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

// edit route
router.get("/:id/edit", isloggedIn, asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        // next();// it is write by me and error  is show by better approach :it's show by flash
        req.flash("error", "Your requested listing does not existing")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
})
);
//update route

router.patch("/:id", isloggedIn, isOwner, asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    // let listing =req.body.listing;
    // console.log(listing);
    // console.log(req.body.listing);
    if (!req.body.listing) {

        throw new ExpressError(404, "send valid data for listing");
    }
    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    req.flash("success", "listing updated!")
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id", isloggedIn, isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete({ _id: id });
    console.log(deletedlisting);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;