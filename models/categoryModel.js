const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category_name:{
        type:String,
        require:true
    },
    category_id:{
        type:String,
        require:true
    },
    status:{
        type:String,
        default:"listed"
    },
    images:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    category_id:{
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

module.exports = mongoose.model('Category', categorySchema);
