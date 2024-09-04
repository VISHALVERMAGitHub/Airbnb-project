const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust"

const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const { nextTick } = require("process");

const ExpressError = require("./utils/ExpressError.js");

const listings =require("./routes/listings.js");
const reviews = require("./routes/review.js");

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
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) => {
    res.send("hi,i am responce");
});



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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

