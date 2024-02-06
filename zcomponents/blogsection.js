const express = require("express");
const router = express.Router();
const DataModel = require("../main/mongoconnect");
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const imagetolink = async (req, res, next) => {
    const { img } = req.body;
    if (img) {


        try {
            cloudinary.config({
                secure: true
            });
            console.log(cloudinary.config());

            cloudinary.uploader.upload(img, { resource_type: "image" }).then(resp => {
                req.base64code = resp.url;
                console.log(resp.url)
                next();
            }).catch((err) => {
                console.log(err);
                next();
            });
        }
        catch (err) {
            console.log("error occured sorry");
            next()
        }

    }
    else{
        next()
    }
};

    router.get('/blog', async (req, res) => {
        const data = await DataModel.find();
        res.json(data[0].blogSection);
    });

    router.put('/blog', async (req, res) => {
        const { img, link, content, title, subtitle, date } = req.body;
        const newItem = { img: img, link: link, content: content, title: title, subtitle: subtitle, date: date };
        const updatedData = await DataModel.findOneAndUpdate({}, { $push: { 'blogSection': newItem } }, { new: true });
        res.json(updatedData);
    });

    router.put('/blog/delete/:id', async (req, res) => {
        const id = req.params.id;
        const deletedData = await DataModel.findOneAndUpdate({}, { $pull: { 'blogSection': { _id: id } } }, { new: true });
        res.json(deletedData);
    });

    router.patch('/blog/edititem/:id', imagetolink, async (req, res) => {
        const { content, link, img, title, subtitle, date, tag } = req.body;
        const id = req.params.id;

        const updateObj = {};
        if (content) updateObj['blogSection.$.content'] = content;
        if (link) updateObj['blogSection.$.link'] = link;
        if (img) updateObj['blogSection.$.img'] = req.base64code;
        if (title) updateObj['blogSection.$.title'] = title;
        if (subtitle) updateObj['blogSection.$.subtitle'] = subtitle;
        if (date) updateObj['blogSection.$.date'] = date;
        if (tag) updateObj['blogSection.$.tag'] = tag;


        try {
            const updatedData = await DataModel.findOneAndUpdate({ 'blogSection._id': id }, { $set: updateObj }, { new: true });
            res.json(updatedData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    router.put('/blog/additem', imagetolink, async (req, res) => {
        const { img, link, content, title, subtitle, date, tag } = req.body;
        const newItem = { img: req.base64code, link: link, content: content, title: title, subtitle: subtitle, date: date, tag: tag };
        const updatedData = await DataModel.findOneAndUpdate({}, { $push: { 'blogSection': newItem } }, { new: true });
        res.json(updatedData);
    });

    module.exports = router;
