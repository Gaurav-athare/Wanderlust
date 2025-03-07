const mongoose = require ("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")



main().then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}

const initDB = async ()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("data is initialized")
}

initDB();