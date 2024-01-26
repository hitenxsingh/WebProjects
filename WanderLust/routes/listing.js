const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateList = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//index route
router.get("/",wrapAsync( async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync( async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/",isLoggedIn ,validateList ,wrapAsync( async (req,res)=>{
    //let{title, description, image, price, country, location} = req.body;
    //const listing = req.body.listing;
    // let newListing = new Listing(req.body.listing);
    let NewList =new Listing(req.body.listing);
    NewList.owner = req.user._id;
    await NewList.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync( async (req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",isLoggedIn, validateList ,wrapAsync( async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing! ");
    }
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn,wrapAsync( async (req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = router;