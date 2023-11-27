const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname+"/public")));

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(Mongo_url);
}


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "MY New Villa",
//         description: "By the hill",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });



app.get("/",(req,res)=>{
    res.send("Hi! I am root");
});

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
app.get("/listings",wrapAsync( async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync( async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//create route
app.post("/listings", validateList ,wrapAsync( async (req,res)=>{
    //let{title, description, image, price, country, location} = req.body;
    //const listing = req.body.listing;
    // let newListing = new Listing(req.body.listing);
    let list =new Listing(req.body.listing);
    await list.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync( async (req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", validateList ,wrapAsync( async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing! ");
    }
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",wrapAsync( async (req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*", (req, res, next)=>{
     next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let{statusCode= 500, message=("Somthing went wrong!")}= err;
    res.render("error.ejs",{err});
    //res.status(statusCode).send(message);
});

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});