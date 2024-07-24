const express = require("express");
const app = express();

const Category = require('../models/categoryModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');


const accountView = async (req, res) => {
    try{
        const id = req.query.id;
        const user = await User.findOne({_id:id});
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        res.render('account',{user: user, category: footer});
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

const addAddressview = async (req, res) => {
    try{
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        res.render('addAddress', {category: footer});   
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
        res.render('editAddress', {category: footer, address: address});
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
            console.log("updated successfully!!!");
            res.redirect('/address');
        }else{
            alert('update failed');
        }
    }catch(error){
        console.log(error.message);
    }
}

const personalDeatilsView = async (req, res) => {
    try{
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        const id = req.session.user_id;
        const user = await User.findOne({_id:id})
        console.log(user);
        res.render('personalDetails', {category:footer, user: user});
    }catch(error){
        console.log(error.message);
    }
}

const updatePersonalDetails = async (req, res) =>{
    try{
        const {name, phone} = req.body;
        const id = req.session.user_id;
        console.log(id)
        const update = await User.findByIdAndUpdate({_id: id},
            {
                $set:{
                    name:name,
                    mobile:phone
                }
            }
        );
        if(update){
            console.log("updated successfully!!!");
            res.redirect('/personal_details');
        }else{
            alert('update failed');
        }
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    accountView,
    addressView,
    addAddressview,
    addAddress,
    editAddressView,
    updateAddress,
    personalDeatilsView,
    updatePersonalDetails
}