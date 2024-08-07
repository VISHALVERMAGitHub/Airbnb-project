const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData =require("./data.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

let initDB =async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data)
    console.log("data base initialized")
}

initDB();