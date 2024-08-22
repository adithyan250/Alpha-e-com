const express = require("express");
const app = express();

const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Address = require("../models/addressModel"); 
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Temporary = require("../models/temporaryModel");

const checkoutview = async (req, res) =>{
    try{
        const orderId = req.query.OrderId;
        const addresses = await Address.find({customer_id:req.session.user_id});
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id:req.session.user_id})
        res.render('checkout', {category:footer, user: user, address: addresses, orderId:orderId});
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

const addAddressview = async (req, res) => {
    try{
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id:req.session.user_id});

        res.render('checkout_add_address',{category:footer, user: user})
    }catch(error){
        console.log(error.message);
    }
}

const addAddress = async (req, res) => {
    try{
        const {name, mobile, add1, add2, landmark, city, pincode} = req.body;
        const user = req.session.user_id;
        const upload = new Address({
            customer_id: user,
            name: name,
            phone:mobile,
            add1: add1,
            add2: add2,
            landmark: landmark,
            city:city,
            pincode: pincode
        })
        const uploaded = await upload.save();
        res.redirect('/checkout');
    }catch(error){
        console.log(error.message);
    }
}

const editAddressView = async (req, res) => {
    try{
        const id = req.query.id;
        const address = await Address.findOne({_id: id});
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id: req.session.user_id})
        res.render('checkout_edit_address', {category: footer, address: address, user:user});
    }catch(error){
        console.log(error.message);
    }
}

const editAddress = async (req, res) => {
    try{
        const id = req.query.id;
        // console.log(id)
        const user = req.session.user_id;
        const {name, mobile, add1, add2, landmark, city, pincode} = req.body;
        const update = await Address.findByIdAndUpdate({_id: id},
            {
                $set:{
                    customer_id: user,
                    name: name,
                    phone:mobile,
                    add1: add1,
                    add2: add2,
                    landmark: landmark,
                    city:city,
                    pincode: pincode
                }
            }
        )
        if(update){
            console.log("updated successfully!!!");
            res.redirect('/checkout');
        }else{
            alert('update failed');
        }
    }catch(error){
        console.log(error.message);
    }
}

const checkout = async (req, res) => {
    try{
        const address = req.body.address;
        const update = await Temporary.updateOne({_id: req.session.order_id},{$set:{
            address: address
        }});
        if(update){
            console.log("updated successfully!!!");
        }
        console.log(address);
    }catch(error){
        console.log(error.message);
    }
}

const buynow = async (req, res) => {
    try{
        const {quantity, price, productId} = req.body;
        const user = req.session.user_id;
        const count = await Order.count();
        const upload = new Temporary({
            customer_id: user,
            productId: productId,
            quantity:quantity,
            status: "order Incomplete",
            next:"/checkout",
            date: new Date()
        })
        const uploaded = await upload.save();
        console.log(uploaded)
        if(uploaded){
            const orderId = uploaded._id.toString();
            req.session.order_id = orderId;
            if(req.session.order_id){
                res.redirect("/checkout");
            }
        }
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    checkoutview,
    buyNowCartView,
    addAddressview,
    addAddress,
    editAddressView,
    editAddress,
    checkout,
    buynow
}