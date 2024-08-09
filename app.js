const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust"
const Listing =require("./models/listing.js");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
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

// create route
app.post("/listings",async (req,res)=>{
    //1a method
    // let {title ,description ,price ,location,country} =req.body ;
    // console.log(title);
    // let list=await new Listing({
    //             title:title,
    //             description:description,
    //             price: price,
    //             location:location,
    //             country:country,
    //         }).save();
    // console.log(list);

    // 1b method
    let listing =req.body.listing
    await new Listing(listing).save();
    // console.log(listing);
    
    res.redirect("/listings");
})

// show route
app.get("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
});
 
// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);

    res.render("listings/edit.ejs",{listing});
})
//update route

app.patch("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    // let listing =req.body.listing;
    // console.log(listing);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// delete route
app.delete("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    let deletedlisting =await Listing.findByIdAndDelete({_id:id});
    console.log(deletedlisting);
    res.redirect("/listings");
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

