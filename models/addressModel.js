const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
});

module.exports = mongoose.model('address', addressSchema);