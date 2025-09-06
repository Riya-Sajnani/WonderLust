const mongoose=require("mongoose");

let listingSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String,
    image:{
        type:String,
        set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:Number,
    location:String,
    country:String
})

let Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;