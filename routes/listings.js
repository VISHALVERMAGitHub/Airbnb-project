const express = require("express");
const router = express.Router();

const asyncWrap = require("../utils/asyncWrap.js");
const listingController = require("../controller/listing.js")

const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
//schema validation as middleware

// index route
// create new listing route
router.route("/")
    .get(listingController.index)
    .post(isloggedIn, validateListing, asyncWrap(listingController.createNewListing));

// new get route
router.get("/new", isloggedIn, listingController.renderNewForm);

// show route
//update route
// delete route
router.route("/:id")
    .get( asyncWrap(listingController.showListing))
    .patch( isloggedIn, isOwner, asyncWrap(listingController.updateListing))
    .delete( isloggedIn, isOwner, asyncWrap(listingController.destroyListing));

// edit route
router.get("/:id/edit", isloggedIn, asyncWrap(listingController.renderEditForm)
);

module.exports = router;