// nntice the spelling of mdatachemas like........ aboutsection ->wrong ..........AboutSection ->correct

const express = require("express")
const DataModel = require("../main/mongoconnect")
const router = express.Router()


router.get('/aboutsection',async (req,res)=>{
    const data =await DataModel.find()
    res.json(data[0].AboutSection)
})

router.put('/aboutsection/description', async (req, res) => {
    const description = req.body.aboutdescription
    console.log(description)
    const updateddata = await DataModel.findOneAndUpdate({}, { "AboutSection.description": description }, { new: true })
    // console.log(updateddata)
    res.json(updateddata)
})

router.put('/aboutsection/addtimestamp', async (req, res) => {
    const { date, content, company, designation } = req.body
    const newitem = {
        Date: date,
        Designation: designation,
        Company: company,
        Content: content
    }
    console.log(newitem)
    const updateddata = await DataModel.findOneAndUpdate({}, { $push: { 'AboutSection.timestamp': newitem } }, { new: true })
    res.json(updateddata)
})

router.patch('/aboutsection/editTimestamp/:id', async (req, res) => {
    const Date = req.body.date
    const Designation = req.body.designation
    const Company= req.body.company
    const Content = req.body.content
    const id = req.params.id;

    // Prepare the update object based on the provided fields
    const updateObj = {};
    if (Designation) updateObj['AboutSection.timestamp.$.Designation'] = Designation;
    if (Company) updateObj['AboutSection.timestamp.$.Company'] = Company;
    if (Content) updateObj['AboutSection.timestamp.$.Content'] = Content;
    if (Date) updateObj['AboutSection.timestamp.$.Date'] = Date;
    console.log(updateObj)
    try {
        // Update the specific fields of the item using findOneAndUpdate with array filters
        const updatedData = await DataModel.findOneAndUpdate(
            { 'AboutSection.timestamp._id': id },
            { $set: updateObj },
            { new: true }
        );

        res.json(updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/aboutsection/deletetimestamp/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const deleteddata = await DataModel.findOneAndUpdate({}, { $pull: { 'AboutSection.timestamp': { _id: id } } }, { new: true })
    res.json(deleteddata)
})















module.exports = router