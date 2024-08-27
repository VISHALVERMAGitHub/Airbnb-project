const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust"
const Listing =require("./models/listing.js");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const { nextTick } = require("process");
const asyncWrap = require("./utils/asyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");
const Review =require("./models/review.js");

main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}


app.listen(8080, () => {
    console.log("server is listening on port 8080")
});
// setup ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
// app.use(express.json());
app.use(methodOverride("_method")); 
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req, res) => {
    res.send("hi,i am responce");
});

// index route
app.get("/listings",async(req, res) => {
    let all_listing = await Listing.find({});
    res.render("listings/index.ejs",{all_listing});
});


// new get route
app.get("/listings/new",(req,res)=>{
    // res.send("success");
    res.render("listings/new.ejs");
})

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

// create new listing route
app.post("/listings",validateListing,asyncWrap(async (req,res)=>{
    
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
    console.log(list);

    // 1b method
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // let listing =req.body.listing ;
    // await new Listing(listing).save();
    // console.log(listing);
    
    res.redirect("/listings"); 
})
);

// show route
app.get("/listings/:id", asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    
    if(!listing){
        next();
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}));
 
// edit route
app.get("/listings/:id/edit",asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);
//update route

app.patch("/listings/:id",asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    // let listing =req.body.listing;
    // console.log(listing);
    // console.log(req.body.listing);
    if(!req.body.listing){
        
        throw new ExpressError(404,"send valid data for listing");
    }
    await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
    
    res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let deletedlisting =await Listing.findByIdAndDelete({_id:id});
    console.log(deletedlisting);
    res.redirect("/listings");
}));

// reviews ka post route
app.post("/listings/:id/reviews", async(req,res)=>{
    let listing=await Listing.findById({_id:req.params.id});
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)

})

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "CastError"){ 
        // res.send("given url error");
        throw new ExpressError(400,"cast error")
    }
    
    next(err);
});

app.all("*",(req,res,next)=>{
    throw new ExpressError(404,"page not found");
})
app.use((err,req,res,next)=>{
    let {status=500,message="some thing wrong"}=err;
    res.status(status).render("listings/error.ejs",{err})
    // res.status(statuscode).send(message);
    
})
// app.get("/testlisting", async (req, res) => {
//     let list1=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price: 12000,
//         location:"calangute,goa",
//         country:"india"
//     });
//     await list1.save();
//     console.log("listing saved");
//     res.send("save data");
// });

