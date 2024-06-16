const express = require("express");
const app = express();
const Cart = require("../models/cartModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

// add to cart 

const addCart = async (req, res) => {
    try {
        let  { product_id, quantity } = req.body;
        quantity = parseInt(quantity)
        const customer_id = req.session.user_id;
        const cartData = await Cart.findOne({ customer_id: customer_id, product_id: product_id });
        let cartSave;
        
        if (cartData) {
            const qty = parseInt(cartData.quantity);
            cartData.quantity = qty + quantity;
            console.log("hdjks")
            cartSave = await cartData.save();

        } else {
            const cart = new Cart({
                product_id: product_id,
                quantity: quantity,
                customer_id: customer_id
            });
            console.log("skljs")
            cartSave = await cart.save();
        }
        
        if (cartSave) {
            console.log("Cart data saved successfully");
            res.redirect(`/cart?customer_id=${customer_id}`);
        }
        // console.log(req.query)
    } catch (error) {
        console.log(error.message);
    }
}

const addCartsingle = async (req, res) => {
    try {
        const product_id = req.query.product_id;
        const quantity = 1;
        const customer_id = req.session.user_id;
        const cartData = await Cart.findOne({ customer_id: customer_id, product_id: product_id });
        let cart;
        let cartSave;

        if (cartData) {
            const quantity = parseInt(cartData.quantity);
            cartData.quantity = quantity + 1;
            cartSave = await cartData.save();
        } else {
            const cart = new Cart({
                product_id: product_id,
                quantity: quantity,
                customer_id: customer_id
            });
            cartSave = await cart.save();
        }
        console.log(cartSave)
        if (cartSave) {
            console.log("Cart data saved successfully");
            res.redirect(`/cart?customer_id=${customer_id}`);
        }
    } catch (error) {
        console.log(error.message);
    }
}

const cartView = async(req, res)=>{
    try {
        let footer;
        let images;
        const customer_id = req.session.user_id;
        const cartItems = await Cart.find();
        images = await Cart.aggregate([{$lookup:{from:"products", localField:"product_id", foreignField:"_id", as:"product_details"}}]);
        footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        // console.log(images);
        res.render('cartPage',{category: footer,cartItems:cartItems});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addCart,
    addCartsingle,
    cartView
}