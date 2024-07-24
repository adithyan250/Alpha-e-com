const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    add1:{
        type:String,
        require:true
    },
    add2:{
        type:String
    },
    landmark:{
        type:String
    },
    city:{
        type:String
    },
    pincode:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('address', addressSchema);