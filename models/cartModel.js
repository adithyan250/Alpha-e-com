const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Cart', cartSchema);