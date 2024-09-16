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
    initData.data = initData.data.map((obj)=>({...obj,owner:'66e526c98901512be917ebe0'}));
    await Listing.insertMany(initData.data);
    console.log("data base initialized")
}

initDB();