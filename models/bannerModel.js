const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    banner_id:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"listed"
    },
    image:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    link:{
        type:String,
        require:true
    },
    created_on:{
        type:Date,
        require:true
    },
    updated_on:{
        type:Date,
        require:true
    }
});

module.exports = mongoose.model('Banner', bannerSchema);

