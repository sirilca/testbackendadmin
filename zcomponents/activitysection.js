const express = require("express")
const DataModel = require("../main/mongoconnect")
const mongoose = require("mongoose")
const router = express.Router()


require('dotenv').config();

const imagetolink = async (req, res, next) => {
    const { img } = req.body

    // const imagebase64data = require("./zcomponents/biography")
    const cloudinary = require('cloudinary').v2;


    // Return "https" URLs by setting secure: true
    cloudinary.config({
        secure: true
    });


    console.log(cloudinary.config());

    cloudinary.uploader.upload(img, { resource_type: "image" }).then(resp => {
        // console.log("success",JSON.stringify(res,null,2))
        console.log(resp.url)
        req.base64code = resp.url
        next()

    }).catch((err) => {
        console.log(err)
        next()
    })
}

router.get('/activity', async (req, res) => {
    const sdata = await DataModel.find()
    res.json(sdata[0].ActivitySection)

})


router.put('/activity', async (req, res) => {
    const { img,link,content} = req.body
    const newitem = { img:img, content:content, link: link }
    console.log(newitem)
    const updateddata = await DataModel.findOneAndUpdate({}, { $push: { 'ActivitySection': newitem } }, { new: true })
    res.json(updateddata)
})


router.put('/activity/delete/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const deleteddata = await DataModel.findOneAndUpdate({}, { $pull: { 'ActivitySection': { _id: id } } }, { new: true })
    res.json(deleteddata)
})

router.patch('/activity/edititem/:id', imagetolink, async (req, res) => {
    // const { itemdescription, imagebase64code, linktext } = req.body;
    const content = req.body.content
    const link = req.body.link
    const img = req.body.img
    const id = req.params.id;
    
    // Prepare the update object based on the provided fields
    const updateObj = {};
    if (content) updateObj['ActivitySection.$.content'] = content;
    if (img) updateObj['ActivitySection.$.img'] = req.base64code;
    if (link) updateObj['ActivitySection.$.link'] = link;
    console.log(updateObj)
    try {
        // Update the specific fields of the item using findOneAndUpdate with array filters
        const updatedData = await DataModel.findOneAndUpdate(
            { 'ActivitySection._id': id },
            { $set: updateObj },
            { new: true }
        );

        res.json(updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/activity/addactivity', imagetolink, async (req, res) => {
    const { content, img, link } = req.body
    const newitem = { content: content, img: req.base64code, link: link }
    console.log(newitem)
    const updateddata = await DataModel.findOneAndUpdate({}, { $push: { 'ActivitySection': newitem } }, { new: true })
    res.json(updateddata)
})


module.exports = router