if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};
const express = require('express');
const user_route = express();
const session = require('express-session');

const product = require('../controllers/productController')
const cartController = require("../controllers/cartController");
const categoryController = require('../controllers/categoryController');
const accountController = require("../controllers/accountController");
const checkoutController = require("../controllers/checkoutController");

const config = require("../config/config");
const auth = require('../middlewares/auth');
const orderAuth = require("../middlewares/checkoutAuth");

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

user_route.get('/addcart', auth.isLogin, cartController.addCartSingle);

user_route.get('/cart', auth.isLogin, cartController.cartView);

user_route.get('/sample', auth.isLogin, userController.sample);

user_route.get('/product_details', auth.isLogin, product.productDetails);

user_route.get('/account', auth.isLogin, accountController.accountView);

user_route.get('/category', auth.isLogin, categoryController.browseCategory);

user_route.get('/address', auth.isLogin,accountController.addressView);

user_route.get('/add_address', auth.isLogin, accountController.addAddressView);

user_route.post('/add_address', accountController.addAddress);

user_route.get('/edit_address', auth.isLogin, accountController.editAddressView);

user_route.post('/edit_address', accountController.updateAddress);

user_route.get('/personal_details', auth.isLogin, accountController.personalDetailsView);

user_route.post('/personal_details', accountController.updatePersonalDetails);

user_route.get('/password', auth.isLogin, accountController.changePasswordView);

user_route.post('/password', accountController.updatePassword);

user_route.get('/buy_now', auth.isLogin, checkoutController.buyNowCartView);

user_route.post('/buy_now', checkoutController.buyNow)

user_route.get('/checkout', auth.isLogin, orderAuth.isLogin, checkoutController.checkoutView);

user_route.post('/checkout', auth.isLogin, checkoutController.checkout)

user_route.get('/checkout_add_address', orderAuth.isLogin, auth.isLogin, checkoutController.addAddressView);

user_route.post('/checkout_add_address', checkoutController.addAddress);

user_route.get("/checkout_edit_address", orderAuth.isLogin, auth.isLogin, checkoutController.editAddressView);

user_route.post("/checkout_edit_address", checkoutController.editAddress);

user_route.post('/verify_payment', checkoutController.verifyPayment);

user_route.get('/order_success', auth.isLogin, checkoutController.orderSuccess);

user_route.get('/order_status', auth.isLogin, checkoutController.orderStatus)






// user_route.get
// middleware removed



// user_route.get("*", auth.isLogout, userController.loginload)

// user_route.get('*',(req, res)=>{
//     res.render('404');
// });

module.exports = user_route;