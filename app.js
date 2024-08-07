const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust"
const Listing =require("./models/listing.js");
main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}
// api

app.listen(8080, () => {
    console.log("server is listening on port 8080")
});

app.set("view engine","ejs");

app.get("/", (req, res) => {
    res.send("hi,i am responce");
});
app.get("/testlisting", async (req, res) => {
    let list1=new Listing({
        title:"my new villa",
        description:"by the beach",
        price: 12000,
        location:"calangute,goa",
        country:"india"
    });
    await list1.save();
    console.log("listing saved");
    res.send("save data");
});