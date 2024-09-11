const express = require("express");
const app = express();

const Razorpay = require('razorpay');

const key_id = process.env.Razorpay_key_id;
const key_secret = process.env.Razorpay_key_secret;

const razorpayInstance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Address = require("../models/addressModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Temporary = require("../models/temporaryModel");
// const { Cursor } = require("mongoose");



const checkoutView = async (req, res) => {
    try {
        const orderId = req.query.OrderId;
        const addresses = await Address.find({ customer_id: req.session.user_id });
        const footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
        const user = await User.findOne({ _id: req.session.user_id })
        res.render('checkout', { category: footer, user: user, address: addresses, orderId: orderId });
    } catch (error) {
        console.log(error.message);
    }
}

const buyNowCartView = async (req, res) => {
    try {
        const product_id = req.query.product_id;
        const product = await Product.find({ _id: product_id });
        const footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
        const user = await User.findOne({ _id: req.session.user_id })
        // console.log(product)
        res.render("buyNowCart", { category: footer, user: user, product: product });
    } catch (error) {
        console.log(error.message);
    }
}

const addAddressView = async (req, res) => {
    try {
        const footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
        const user = await User.findOne({ _id: req.session.user_id });

        res.render('checkout_add_address', { category: footer, user: user })
    } catch (error) {
        console.log(error.message);
    }
}

const addAddress = async (req, res) => {
    try {
        const { name, mobile, add1, add2, landmark, city, pincode } = req.body;
        const user = req.session.user_id;
        const upload = new Address({
            customer_id: user,
            name: name,
            phone: mobile,
            add1: add1,
            add2: add2,
            landmark: landmark,
            city: city,
            pincode: pincode
        })
        const uploaded = await upload.save();
        res.redirect('/checkout');
    } catch (error) {
        console.log(error.message);
    }
}

const editAddressView = async (req, res) => {
    try {
        const id = req.query.id;
        const address = await Address.findOne({ _id: id });
        const footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
        const user = await User.findOne({ _id: req.session.user_id })
        res.render('checkout_edit_address', { category: footer, address: address, user: user });
    } catch (error) {
        console.log(error.message);
    }
}

const editAddress = async (req, res) => {
    try {
        const id = req.query.id;
        // console.log(id)
        const user = req.session.user_id;
        const { name, mobile, add1, add2, landmark, city, pincode } = req.body;
        const update = await Address.findByIdAndUpdate({ _id: id },
            {
                $set: {
                    customer_id: user,
                    name: name,
                    phone: mobile,
                    add1: add1,
                    add2: add2,
                    landmark: landmark,
                    city: city,
                    pincode: pincode
                }
            }
        )
        if (update) {
            console.log("updated successfully!!!");
            res.redirect('/checkout');
        } else {
            alert('update failed');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const checkout = async (req, res) => {
    try {
        const address = req.body.address;
        const update = await Temporary.findByIdAndUpdate(req.session.order_id, {
            $set: {
                address: address,
                status: "payment pending",
                next: ""
            }
        },
            { new: true }
        );

        if (update) {
            const user = await User.findOne({ _id: req.session.user_id })
            const order = await Temporary.findOne({ _id: req.session.order_id }).populate("productId");
            const product = order.productId;
            let order_id = await Order.count();
            order_id = order_id + 10002
            order_id = "" + order_id;
            console.log(product);
            let amount = product.price * order.quantity;
            const options = {
                amount: amount * 100,
                currency: 'INR',
                receipt: order_id
            }

            razorpayInstance.orders.create(options,
                (err, orders) => {
                    if (!err) {
                        console.log(amount);
                        res.status(200).send({
                            success: true,
                            msg: 'order Created successfully',
                            order: orders,
                            order_id: order_id,
                            amount: amount,
                            key_id: key_id,
                            product_name: product.title,
                            description: product.description,
                            contact: user.mobile,
                            name: user.name,
                            email: user.email
                        })

                    } else {
                        console.log(err)
                        res.status(400).send({ success: false, msg: 'Something went wrong!' });
                    }
                }
            )
        }

    } catch (error) {
        console.log(error.message);
    }
}

const buyNow = async (req, res) => {
    try {
        const { quantity, price, productId } = req.body;
        const user = req.session.user_id;
        const count = await Order.count();
        const upload = new Temporary({
            customer_id: user,
            productId: productId,
            quantity: quantity,
            status: "order Incomplete",
            next: "/checkout",
            date: new Date()
        })
        const uploaded = await upload.save();
        // console.log(uploaded)
        if (uploaded) {
            const orderId = uploaded._id;
            req.session.order_id = orderId;
            if (req.session.order_id) {
                res.redirect("/checkout");
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyPayment = async (req, res) => {
    try {
        
        const crypto = require("crypto");
        let hmac = crypto.createHmac('sha256', key_secret);
        const razorpay_order_id = req.body.payment.razorpay_order_id;
        const razorpay_payment_id = req.body.payment.razorpay_payment_id;
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        hmac = hmac.digest('hex');
        if (hmac === req.body.payment.razorpay_signature) {
            const temp = await Temporary.findOne({ _id: req.session.order_id });
            let count = await Order.count();
            count = count + 10001;
            const orderUpdate = new Order({
                customer_id: req.session.user_id,
                orderId: count,
                productId: temp.productId,
                quantity: temp.quantity,
                status: "order completed",
                paymentId: req.body.payment,
                date: new Date()
            })
            const uploaded = await orderUpdate.save();
            if(uploaded){
                req.session.order_id = uploaded._id;
                const order = await Order.findOne({_id: req.session.order_id});
                res.json({paymentStatus: true});
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const orderSuccess = async (req, res) => {
    try{
        const order = await Order.find({_id : req.session.order_id}).populate("productId");
        const product = [];
        for(let i =0; i< order.length;i++){
            product.push(order[i].productId);
        }
        console.log("orders:", order);
        const user = await User.findOne({ _id: req.session.user_id })
        const footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
        res.render('orderSuccess',{category: footer, user: user, order: order, product: product});
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    checkoutView,
    buyNowCartView,
    addAddressView,
    addAddress,
    editAddressView,
    editAddress,
    checkout,
    buyNow,
    verifyPayment,
    orderSuccess
}