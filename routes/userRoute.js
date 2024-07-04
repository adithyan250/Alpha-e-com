if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};
const express = require('express');
const user_route = express();
const session = require('express-session');

const product = require('../controllers/productController')
const cartController = require("../controllers/cartController");
const categoryController = require('../controllers/categoryController')

const config = require("../config/config");
const auth = require('../middlewares/auth');

user_route.use(session({secret: process.env.sessionSecret}));

const bodyParser = require('body-parser');

user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');


user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const path = require('path')

user_route.use(express.static('public'));

const userController = require("../controllers/userController");

user_route.get('/user_registration', auth.isLogout, userController.loadRegister);

user_route.post('/user_registration',userController.insertUser);

user_route.get('/', auth.isLogout, userController.loginload);

user_route.get('/user_signin', auth.isLogout, userController.loginload);

user_route.post('/user_signin',userController.verifyLogin);

user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/user_logout', auth.isLogin, userController.userLogout);

user_route.get('/email_verification', auth.isLogout, userController.emailVerification);

user_route.post('/email_verification', userController.verifyOTP);

user_route.get('/email_verification_resend_otp', auth.isLogout, userController.emailVerifyResendOtp);

user_route.get('/forgot_password', auth.isLogout, userController.emailEntryForgotPassword);

user_route.post('/forgot_password', userController.getEmail);

user_route.get('/forgot_password_resend_otp', auth.isLogout, userController.resendotp);

user_route.get("/forgot_password_otp", auth.isLogout, userController.forgetPasswordOtp);

user_route.post('/forgot_password_otp', userController.forgetPasswordOtpVerify);

user_route.post('/new_password', userController.newPassword);

user_route.get('/search', auth.isLogin, product.browseProducts);

user_route.post('/search', product.browseProducts);

user_route.post('/sample', userController.sample);

user_route.get('/view_products', auth.isLogin, product.productView);

user_route.get('/enter_email', auth.isLogout, userController.emailEntry);

user_route.post('/enter_email', userController.verifyEmail);

user_route.post('/addcart', cartController.addCart);

user_route.get('/addcart', auth.isLogin, cartController.addCartsingle);

user_route.get('/cart', auth.isLogin, cartController.cartView);

user_route.get('/sample', auth.isLogout, userController.sample);

user_route.get('/product_details', auth.isLogin, product.productDetails);

user_route.get('/account', auth.isLogin, userController.accountView);

user_route.get('/category', auth.isLogin, categoryController.browseCategory)

// middleware removed

// user_route.get("*", auth.isLogout, userController.loginload)

// user_route.get('*',(req, res)=>{
//     res.render('404',{message:'page not found...'});
// })


module.exports = user_route;