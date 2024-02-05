const mongoose = require("mongoose")

const dataschema=new mongoose.Schema({
    name:String,
    class:[{
        id:String,
        num:Number
    }],
    bio:{
        desc:String,
        items:[{
            Date:String,
            designation:String
        }]
    }
})

const mon=mongoose.model("newone",dataschema)

module.exports={mon}