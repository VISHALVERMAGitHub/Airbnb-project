const express = require("express");
const router = express.Router();

const asyncWrap = require("../utils/asyncWrap.js");
const listingController = require("../controller/listing.js")

const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
//schema validation as middleware


// index route
router.get("/", listingController.index);


// new get route
router.get("/new", isloggedIn, listingController.renderNewForm)

// create new listing route
router.post("/", isloggedIn, validateListing, asyncWrap(listingController.createNewListing)
);

// show route
router.get("/:id", asyncWrap(listingController.showListing));

// edit route
router.get("/:id/edit", isloggedIn, asyncWrap(listingController.renderEditForm)
);
//update route

router.patch("/:id", isloggedIn, isOwner, asyncWrap(listingController.updateListing));

// delete route
router.delete("/:id", isloggedIn, isOwner, asyncWrap(listingController.destroyListing));

module.exports = router;