const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};

module.exports.renderNewForm =(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing =async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res)=>{
    //let{title, description, image, price, country, location} = req.body;
    //const listing = req.body.listing;
    // let newListing = new Listing(req.body.listing);
    let NewList =new Listing(req.body.listing);
    NewList.owner = req.user._id;
    await NewList.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing! ");
    }
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
};