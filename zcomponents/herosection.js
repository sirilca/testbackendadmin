const express = require("express");
const router = express.Router();
const DataModel = require("../main/mongoconnect");

router.get('/herosection', async (req, res) => {
    try {
        const data = await DataModel.findOne();
        res.json(data.heroSection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/herosection/description', async (req, res) => {
    const { description } = req.body;
    try {
        const updatedData = await DataModel.findOneAndUpdate({}, { 'heroSection.description': description }, { new: true });
        res.json(updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/herosection/mailingApi', async (req, res) => {
    const { mailingApi } = req.body;
    console.log(mailingApi)
    try {
        const updatedData = await DataModel.findOneAndUpdate({}, { 'heroSection.MailingApi': mailingApi }, { new: true });
        res.json(updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
