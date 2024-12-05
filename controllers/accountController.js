const express = require("express");
const app = express();

const Category = require('../models/categoryModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

const bcrypt = require('bcrypt');


const accountView = async (req, res) => {
    try{
        const id = req.session.user_id;
        console.log(req.session)
        const user = await User.findOne({_id:id});
        const orders = await Order.find({customer_id: req.session.user_id}).populate("productId");
        let date = [];
        for(let i =0; i < orders.length; i++){
            date.push(orders[i].date.toString().split(" "));
        } ;
        // console.log("dates:", date);
        // console.log("orders:", orders);
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        res.render('account',{user: user, category: footer, orders: orders, date: date});
    }catch(error){
        console.log(error.message);
    }
}

const addressView = async (req, res) => {
    try{
        const user = await User.findOne({_id:req.session.user_id},{name:1, email:1});
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const addresses = await Address.find({customer_id:req.session.user_id});
        res.render("address", {category: footer, user: user, address: addresses});
    }catch(error){
        console.log(error.message);
    }
}

const addAddressView = async (req, res) => {
    try{
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id: req.session.user_id});
        // console.log(user);
        
        res.render('addAddress', {category: footer, user: user});   
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
        res.redirect('/address');
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
        res.render('editAddress', {category: footer, address: address, user:user});
        // console.log(id)
    }catch(error){
        console.log(error.message);
    }
}

const updateAddress = async (req, res) =>{
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
            // console.log("updated successfully!!!");
            res.redirect('/address');
        }else{
            alert('update failed');
        }
    }catch(error){
        console.log(error.message);
    }
}

const personalDetailsView = async (req, res) => {
    try{
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const id = req.session.user_id;
        const user = await User.findOne({_id:id})
        // console.log(user);
        res.render('personalDetails', {category:footer, user: user});
    }catch(error){
        console.log(error.message);
    }
}

const updatePersonalDetails = async (req, res) =>{
    try{
        const {name, phone} = req.body;
        const id = req.session.user_id;
        // console.log(id)
        const update = await User.findByIdAndUpdate({_id: id},
            {
                $set:{
                    name:name,
                    mobile:phone
                }
            }
        );
        if(update){
            // console.log("updated successfully!!!");
            res.redirect('/personal_details');
        }else{
            alert('update failed');
        }
    }catch(error){
        console.log(error.message);
    }
}

const changePasswordView = async (req, res) => {
    try{
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const user = await User.findOne({_id:req.session.user_id});
        res.render('changePassword', {category: footer, user: user});
    }catch(error){
        console.log(error.message);
    }
}

const updatePassword = async (req, res) => {
    try {
        const {opass, pass, conpass} = req.body;
        const user = await User.findOne({_id:req.session.user_id});
        // console.log(user)
        const passwordMatch = await bcrypt.compare(opass, user.password);
        if(passwordMatch || pass === conpass){
            const passwordHash = await bcrypt.hash(pass, 10)
            const updated = await User.findByIdAndUpdate({_id:req.session.user_id},{
                $set:{
                    password:passwordHash
                }
            })
            res.redirect('/password')
        }else{
            // console.log("Incorrect Password...");
            alert("Incorrect Password...");
        }
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    accountView,
    addressView,
    addAddressView,
    addAddress,
    editAddressView,
    updateAddress,
    personalDetailsView,
    updatePersonalDetails,
    changePasswordView,
    updatePassword
}