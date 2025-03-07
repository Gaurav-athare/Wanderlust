const express = require("express")
const app = express()
const mongoose = require("mongoose")
const port = 3000;
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate") //we install ejsmate for making boilerplate or templates
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const Review = require("./models/review.js")

app.listen(port, ()=>{
    console.log("listening to port number 3000")

})

main().then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req,res)=>{
    res.send("working")
})





// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:"1800",
//         location:"Cangulate, Goa",
//         country:"India"
//     })

//     await sampleListing.save().then((res)=>{
//         console.log("Successfully added");
//     });
// })


//INDEX Route
app.get("/listings", wrapAsync(async (req, res) =>{
   const allListings = await Listing.find({})
   res.render("./listings/index.ejs", {allListings})
}));

//NEW Route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs")
})

//CREATE Route
app.post("/listings", wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//SHOW Route

app.get("/listings/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params; // to get id we have to parse all data which is coming from req and for this we have to write oneline which is written above
    //now we have id so we find data with the help of it 
    const listing = await Listing.findById(id)
    // now this incoming data will pass to the show.ejs
    res.render("./listings/show.ejs" , {listing})
}));

//EDIT Route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id)
    res.render("./listings/edit.ejs", {listing})
}));

//now this post reqeust is conveted into the put
//UPDATE Route
app.put("/listings/:id",  wrapAsync(async(req,res)=>{
    let {id} = req.params
    //to extract listing
     await Listing.findByIdAndUpdate(id, {...req.body.listing})  //{...req.body.Listing}-> this ... means deconstructing. Basically 'req.body.Listing' is a javascript object containing all parameters and we deconstructing this to get all parameters in the individual values
    res.redirect("/listings") 
}));

//DELETE Route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    res.redirect("/listings")
}));

//reviews
//POST Route
app.post("/listings/:id/reviews", async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()

    // console.log("new review saved")
    // res.send("new review saved")
    res.redirect('/listings')
})

app.all("*", (req, res, next) =>{
    next(ExpressError("404", "Page Not Found!"))
})

app.use((err, req, res, next) => {
   let {StatusCode = 500, message = "Something Went Wrong!"} = err;
    res.status(StatusCode).render("error.ejs", {err});
});
