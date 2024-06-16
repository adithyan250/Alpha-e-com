const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    customer_id:{
        type:String,
        require:true
    },
    product_id:{
        type:String,
        require:true
    },
    quantity:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Cart', cartSchema);