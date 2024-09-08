const express=require("express");
const router = express.Router();

const Listing =require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");

//schema validation as middleware
const validateListing =(req,res,next)=>{
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
        // console.log(value);
        throw new ExpressError(400, error.details[0].message); // Properly handling validation errors
    }
    else{
        next();
    }
}

// index route
router.get("/",async(req, res) => {
    let all_listing = await Listing.find({});
    res.render("listings/index.ejs",{all_listing});
});


// new get route
router.get("/new",(req,res)=>{
    // res.send("success");
    res.render("listings/new.ejs");
})

// create new listing route
router.post("/",validateListing,asyncWrap(async (req,res)=>{
    
    //1a method
// console.log(req.body);

let {title ,description ,price ,location,country} =req.body ;
// console.log(title);
let list=await new Listing({
            title:title,
            description:description,
            price: price,
            location:location,
            country:country,
        }).save();
// console.log(list);

// 1b method
// let result=listingSchema.validate(req.body);
// console.log(result);
// let listing =req.body.listing ;
// await new Listing(listing).save();
// console.log(listing);
req.flash("success","New listing Created!")
res.redirect("/listings"); 
})
);

// show route
router.get("/:id", asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id).populate("reviews");
    
    if(!listing){
        // next();// it is write by me and error  is show by better approach :it's show by flash
        req.flash("error","Your requested listing does not existing")
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}));
 
// edit route
router.get("/:id/edit",asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        // next();// it is write by me and error  is show by better approach :it's show by flash
        req.flash("error","Your requested listing does not existing")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
})
);
//update route

router.patch("/:id",asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    // let listing =req.body.listing;
    // console.log(listing);
    // console.log(req.body.listing);
    if(!req.body.listing){
        
        throw new ExpressError(404,"send valid data for listing");
    }
    await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
    req.flash("success","listing updated!")
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id", asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let deletedlisting =await Listing.findByIdAndDelete({_id:id});
    console.log(deletedlisting);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));

module.exports=router;