const express = require("express");
const app = express();
const mongoose = require("mongoose");
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
// api
const port=8080;
app.listen(port, () => {
    console.log("server is listening on port 8080")
});
app.get("/", (req, res) => {
    res.send("hi,i am responce");
});