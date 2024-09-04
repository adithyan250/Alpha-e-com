const multer = require('multer');
const path = require('path')

productStorge = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/images/products'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        // console.log(file.originalname);
        cb(null,name);
    }
})
const productUpload = multer({storage:productStorge});

module.exports = {productUpload}