require('dotenv').config();

// const imagebase64data=require("./zcomponents/biography")
const cloudinary = require('cloudinary').v2;


// const cloudinaryUrl = process.env.CLOUDINARY_URL;

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true
});

// Log the configuration
console.log(cloudinary.config());

cloudinary.uploader.upload("./images/SIRIL C ANTONY.jpg",{resource_type:"image"}).then(res=>{
    // console.log("success",JSON.stringify(res,null,2))
    console.log(res.url)
})
.catch((err)=>console.log(err))
