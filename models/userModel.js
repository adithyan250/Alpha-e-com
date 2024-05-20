const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    is_admin:{
        type:Number,
        require:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        require:true
    },
    token:{
        type:String,
        default:''
    }
});


module.exports = mongoose.model('User',userSchema);
// const LeafSchema = new mongoose.Schema({ 
//     name: String, 
//     enroll: Number, 
//     courseId: Number 
// });
// module.exports = {
//     User
//     // Leaf
// }