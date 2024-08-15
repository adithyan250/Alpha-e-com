const express = require("express");
const app = express();

const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Address = require("../models/addressModel"); 
const Product = require("../models/productModel");

const checkoutview = async (req, res) =>{
    try{
        
        const addresses = await Address.find({customer_id:req.session.user_id});
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id:req.session.user_id})
        res.render('checkout', {category:footer, user: user, address: addresses});
    }catch(error){
        console.log(error.message);
    }
}

const buyNowCartView = async (req, res)=>{
    try{
        const product_id = req.query.product_id;
        const product = await Product.find({_id:product_id});
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id:req.session.user_id})
        console.log(product)
        res.render("buyNowCart", {category:footer, user: user, product: product});
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    checkoutview,
    buyNowCartView
}
