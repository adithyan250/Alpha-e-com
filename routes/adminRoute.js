if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};

const express = require('express')
const admin_route = express();
const session = require('express-session');
const passport = require('passport')
const flash = require('express-flash')


const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const subcategoryController = require('../controllers/subCategoryController');
// const bannerController = require('../controllers/bannerController');
const storgeController = require('../controllers/storageController')
const User = require('../models/userModel');


const initializePassport = require('../config/passport-config')
  initializePassport(
  passport,
   email =>  User.findOne({email: email}),
   id => User.findOne({_id:id})
)

const auth = require('../middlewares/adminAuth');
const config = require('../config/config');
const MongoStore = require('connect-mongo');
// admin_route.use(session({secret: process.env.sessionSecret}))
admin_route.use(
    session({
      secret: process.env.sessionSecret,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/alpha_e-com' }),
      cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        httpOnly: true,
        secure: false // Set to true if using HTTPS
    } // Set `true` if using HTTPS
    },
    )
  );
const bodyParser = require('body-parser');


admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin');

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));
admin_route.use(flash())

admin_route.use(passport.initialize())
admin_route.use(passport.session())

const multer = require('multer');
const path = require('path'); 

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        console.log(file.originalname);
        cb(null,name);
    }
})

const upload = multer({storage:storage});


// console.log("admin route:", request.session)

admin_route.get('/admin_login', auth.isLogout,adminController.loadLogin);

admin_route.post('/admin_login', passport.authenticate('local', {
    successRedirect: '/admin/admin_panel',
    failureRedirect: '/admin/admin_login',
    failureFlash: true
  }));

admin_route.get('/admin_panel', auth.checkAuthenticated, adminController.loadDashboard);

admin_route.get('/admin_logout', auth.checkAuthenticated, adminController.logout)

admin_route.get('/admin_panel/category', auth.authenticated, categoryController.categoryLoad);

admin_route.get('/admin_panel/category/add_category', auth.authenticated, categoryController.addCategory);

admin_route.post('/admin_panel/category/add_category', categoryController.insertCategory);

admin_route.get('/admin_panel/category/edit_category', auth.authenticated, categoryController.editCategory);

admin_route.post('/admin_panel/category/edit_category', categoryController.updateCategory);

admin_route.get('/admin_panel/category/subcategory', auth.authenticated, subcategoryController.subcategoryload);

admin_route.get('/admin_panel/category/subcategory/add_subcategory', auth.authenticated, subcategoryController.addSubCategory);

admin_route.post('/admin_panel/category/subcategory/add_subcategory', auth.authenticated, subcategoryController.insertSubCategory);

admin_route.get('/admin_panel/category/edit_subcategory', auth.authenticated, subcategoryController.editSubCategory);

admin_route.post('/admin_panel/category/subcategory/edit_subcategory', auth.authenticated, subcategoryController.updateSubcategory);

admin_route.get('/admin_panel/products', auth.authenticated, productController.productLoad);

admin_route.get('/admin_panel/products/add_product',auth.authenticated, productController.addProductLoad);

admin_route.get('/admin_panel/products/add_product_get_data',auth.authenticated, productController.subcategoryDataLoad);

admin_route.post('/admin_panel/products/add_product',storgeController.productUpload.array('images',5), productController.addProduct);

admin_route.get('/admin_panel/products/edit_product',auth.authenticated, productController.editProductLoad);

admin_route.post('/admin_panel/products/edit_product', auth.authenticated, productController.updateProduct);

admin_route.get('/admin_panel/customers', auth.authenticated, adminController.customersLoad);

admin_route.get('/admin_panel/customers/details', auth.authenticated, adminController.customerDetails);

// admin_route.get('/admin_panel/banner_manage', auth.isLogin, bannerController.bannerManage);

// admin_route.get('/admin_panel/bannermanage/add_banner', auth.isLogin, bannerController.addBanner);

// admin_route.post('/admin_panel/bannermanage/add_banner', upload.single('images'), bannerController.insertBanner);

// admin_route.get('/admin_panel/bannermanage/edit_banner', auth.isLogin, bannerController.editBanner);

// admin_route.post('/admin_panel/bannermanage/edit_banner', upload.single('images'), bannerController.updateBanner)

admin_route.get('/admin_panel/orders', auth.authenticated, adminController.ordersLoad);

admin_route.get('/sample', auth.isLogout, adminController.sample);

// admin_route.get('*',(req, res)=>{
//     res.redirect('/admin/admin_login');
// })

module.exports = admin_route;