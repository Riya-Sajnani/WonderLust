const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const path= require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/expressError.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);

main()
.then(()=>{
    console.log("working");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

app.get("/",(req,res)=>{
    res.send("working");
})
//index route
app.get("/listing",wrapAsync(async(req,res)=>{
    let allListing=await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}))
//new Route
app.get("/listing/new",wrapAsync(async(req,res)=>{
    res.render("listing/new.ejs");
}))
//create route
app.post("/listing",wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Post Valid Listing")
    }
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
    console.log(req.body.listing);
}))

//show route
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
}))

//edit route
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
}))
//update route
app.put("/listing/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Post Valid Listing")
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    res.redirect(`/listing/${id}`);

}))
//Delete route
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
}))

// app.get("/test",async (req,res)=>{
//     let samplelisting=new Listing({
//         title:"New Villa",
//         description:"Near by Sea",
//         price:1200,                                       
//         location:"Goa",
//         Country:"India"
//     })
//     await samplelisting.save();
//     res.send("working");
//     console.log("saved");
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!!"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!!"}=err;
    res.status(statusCode).render("listing/error.ejs",{message});
    //res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("listening");
})