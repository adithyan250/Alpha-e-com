const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/alpha_e-com");

const express = require("express");
const app = express();

app.use((req, res, next)=>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires','-1');
    res.header('Pragma', 'no-cache')
    next();
})

//for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

app.listen(3000, function(){
    console.log('Server is running on http://localhost:3000/admin/admin_login');
});
// account?id=6583e53ad74a9534dbc0e91f