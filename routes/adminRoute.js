if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};

const express = require('express')
const admin_route = express();
const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({secret: process.env.sessionSecret}))
const bodyParser = require('body-parser');


const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const subcategoryController = require('../controllers/subCategoryController');
const bannerController = require('../controllers/bannerController');
const storgeController = require('../controllers/storageController');


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin');

const multer = require('multer');
const path = require('path')

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

const auth = require('../middlewares/adminAuth');


admin_route.get('/admin_login', auth.isLogout,adminController.loadLogin);

admin_route.post('/admin_login', adminController.verifyLogin);

admin_route.get('/admin_panel', auth.isLogin, adminController.loadDashboard);

admin_route.get('/admin_logout', auth.isLogin, adminController.logout)

admin_route.get('/admin_panel/category', auth.isLogin, categoryController.categoryLoad);

admin_route.get('/admin_panel/category/add_category', auth.isLogin, categoryController.addCategory);

admin_route.post('/admin_panel/category/add_category', categoryController.insertCategory);

admin_route.get('/admin_panel/category/edit_category', auth.isLogin, categoryController.editCategory);

admin_route.post('/admin_panel/category/edit_category', categoryController.updateCategory);

admin_route.get('/admin_panel/category/subcategory', auth.isLogin, subcategoryController.subcategoryload);

admin_route.get('/admin_panel/category/subcategory/add_subcategory', auth.isLogin, subcategoryController.addSubCategory);

admin_route.post('/admin_panel/category/subcategory/add_subcategory', auth.isLogin, subcategoryController.insertSubCategory);

admin_route.get('/admin_panel/category/edit_subcategory', auth.isLogin, subcategoryController.editSubCategory);

admin_route.post('/admin_panel/category/subcategory/edit_subcategory', auth.isLogin, subcategoryController.updateSubcategory);

admin_route.get('/admin_panel/products', auth.isLogin, productController.productLoad);

admin_route.get('/admin_panel/products/add_product',auth.isLogin, productController.addProductLoad);

admin_route.get('/admin_panel/products/add_product_get_data',auth.isLogin, productController.subcategoryDataLoad);

admin_route.post('/admin_panel/products/add_product',storgeController.productUpload.array('images',5), productController.addProduct);

admin_route.get('/admin_panel/products/edit_product',auth.isLogin, productController.editProductLoad);

admin_route.post('/admin_panel/products/edit_product', auth.isLogin, productController.updateProduct);

admin_route.get('/admin_panel/customers', auth.isLogin, adminController.customersLoad);

admin_route.get('/admin_panel/customers/details', auth.isLogin, adminController.customerdetails);

// admin_route.get('/admin_panel/banner_manage', auth.isLogin, bannerController.bannerManage);

// admin_route.get('/admin_panel/bannermanage/add_banner', auth.isLogin, bannerController.addBanner);

// admin_route.post('/admin_panel/bannermanage/add_banner', upload.single('images'), bannerController.insertBanner);

// admin_route.get('/admin_panel/bannermanage/edit_banner', auth.isLogin, bannerController.editBanner);

// admin_route.post('/admin_panel/bannermanage/edit_banner', upload.single('images'), bannerController.updateBanner)

admin_route.get('/sample', auth.isLogout, adminController.sample);


// admin_route.get('*',(req, res)=>{
//     res.redirect('/admin/admin_login');
// })


module.exports = admin_route;