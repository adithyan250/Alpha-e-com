const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId:{
        type:String,
        require:true
    },
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity:{
        type:String,
        require:true
    },
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    status:{
        type:String,
        require:true
    },
    paymentId:{
        type:Object,
        require:true
    },
    date:{
        type:Date,
        require:true
    }
    
});

module.exports = mongoose.model('order', OrderSchema);