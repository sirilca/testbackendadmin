const mongoose = require('mongoose');

// Define the Mongoose schema
const dataSchema = new mongoose.Schema({
    heroSection: {
        description: String,
        MailingApi: String
    }, 
    biography: {
        description: String,
        items: [{
            image: String,
            description: String,
            link: String
        }]
    },
    blogSection: [{
        title: String,
        subtitle: String,
        img: String,
        content: String,
        date: Date,
        tag:String
    }],
    ActivitySection: [{
        link: String,
        img: String,
        content: String
    }],
    contactSection: {
        apiLink: String
    },
    AboutSection: {
        description: String,
        timestamp: [{
            Date: String,
            Designation: String,
            Company: String,
            Content: String
        }]
    }
});

// Create a Mongoose model using the schema
const DataModel = mongoose.model('Data', dataSchema);

module.exports = DataModel;
