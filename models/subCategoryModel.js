const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    subCategory_id:{
        type:String,
        required:true
    },
    subCategory_name:{
        type:String,
        required:true
    },
    category_id:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:"listed"
    },
    description:{
        type:String,
        required:true
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

module.exports = mongoose.model('Subcategory', subcategorySchema);