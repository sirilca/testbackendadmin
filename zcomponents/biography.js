const express = require("express")
const DataModel = require("../main/mongoconnect")
const mongoose = require("mongoose")
const router = express.Router()
require('dotenv').config();

const imagetolink = async (req, res, next) => {
    const { imagebase64code } = req.body

    if (imagebase64code) {



        try {
            // const imagebase64data = require("./zcomponents/biography")
            const cloudinary = require('cloudinary').v2;


            // Return "https" URLs by setting secure: true
            cloudinary.config({
                secure: true
            });


            console.log(cloudinary.config());


            await cloudinary.uploader.upload(imagebase64code, { resource_type: "image" }).then(resp => {
                // console.log("success",JSON.stringify(res,null,2))
                console.log(resp.url)
                console.log("we are in side uploader");
                req.base64code = resp.url
                next()

            }).catch((err) => {
                console.log(err)
                next()
            })
        }
        catch (err) {
            console.log("error occured sorry")
            next()

        }
    }
    else{
        next()
    }
}

router.get('/biography', async (req, res) => {
    const sdata = await DataModel.find()
    // var docid=sdata._id
    res.json(sdata[0].biography)

})

router.put('/biography/description', async (req, res) => {
    const description = req.body.biodata
    console.log(description)
    const updateddata = await DataModel.findOneAndUpdate({}, { "biography.description": description }, { new: true })
    // console.log(updateddata)
    res.json(updateddata)
})

router.put('/biography/additem', imagetolink, async (req, res) => {
    const { itemdescription, imagebase64code, linktext } = req.body
    const newitem = { description: itemdescription, image: req.base64code, link: linktext }
    console.log(newitem)
    const updateddata = await DataModel.findOneAndUpdate({}, { $push: { 'biography.items': newitem } }, { new: true })
    res.json(updateddata)
})


router.put('/biography/delete/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const deleteddata = await DataModel.findOneAndUpdate({}, { $pull: { 'biography.items': { _id: id } } }, { new: true })
    res.json(deleteddata)
})


router.patch('/biography/edititem/:id', imagetolink, async (req, res) => {
    // const { itemdescription, imagebase64code, linktext } = req.body;
    const description = req.body.itemdescription
    const link = req.body.linktext
    const image = req.body.imagebase64code
    const id = req.params.id;

    // Prepare the update object based on the provided fields
    const updateObj = {};
    if (description) updateObj['biography.items.$.description'] = description;
    if (req.base64code) updateObj['biography.items.$.image'] = req.base64code;
    if (link) updateObj['biography.items.$.link'] = link;
    console.log(updateObj)
    try {
        // Update the specific fields of the item using findOneAndUpdate with array filters
        const updatedData = await DataModel.findOneAndUpdate(
            { 'biography.items._id': id },
            { $set: updateObj },
            { new: true }
        );

        res.json(updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router