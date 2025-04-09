// const userModel = require('../models/userModel');
const User = require('../models/userModel');
const config = require('../config/config');
const bcrypt = require('bcrypt')
const express = require("express");
const app = express();
const Order = require('../models/orderModel');

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
})

// secure password

const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

// admin login page view

const loadLogin = async (req, res) => {
    try {
        console.log(req.session);
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

// admin login verification

const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // const email = "adithyanpb@gmail.com";
        // const spass = await bcrypt.hash(password, 10)
        // console.log(spass)
        const userData = await User.findOne({ email: email });
        // const spassword = await securePassword(password);
        // console.log(spassword)
        // console.log(spassword);
        if (userData.email === email) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: 'Email and Password is incorrect.' });
                } else {
                    const id = userData._id;
                    const admin_id = id.toHexString();

                    req.session.admin = admin_id;
                    console.log("auth: ",req.session);
                    const user = await User.findOne({_id:id})
                    console.log(user)
                    res.redirect('/admin/admin_panel');
                }
            } else {
                res.render('login', { message: 'Email and Password is incorrect.' });
            }
        } else {
            res.render('login', { message: 'Email and Password is incorrect.' });
        }
    } catch (error) {
        console.log(error.message);
    }
}



// admin panel view
const loadDashboard = async (req, res) => {
    try {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        console.log("panel:", req.session);
        const userData = await User.findById({ _id: req.session.passport.user });
        res.cookie('user', '47984719749874179', { maxAge: 900000, httpOnly: true });
        // req.session.user_id = req.session.user_id;
        // req.session.admin = userData._id;
        req.session.save();
        console.log("after changing : ", req.session)
        res.render('home', { admin: userData });
        // console.log("dashboard: ", res);
    } catch (error) {
        console.log(error.message);
    }
}

// admin logout

const logout = async (req, res) => {
    try {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        req.logOut()
        req.session.destroy();
        res.redirect('/admin/admin_login');
    } catch (error) {
        console.log(error.message);
    }
}

const customersLoad = async (req, res) => {
    try {

        let search;
        search = ''
        if (req.query.text) {
            search = req.query.text;
        }

        console.log(search);
        let userData;
        let Sort;


        if (req.query) {

            const sort = req.query.sort
            switch (sort) {
                case "1":
                    userData = await User.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ name: 1 });
                    Sort = "name:A-Z";
                    break;

                case "2":
                    userData = await User.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ name: -1 })
                    Sort = "name:Z-A";
                    break;

                case "3":
                    userData = await User.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ id: 1 })
                    Sort = "id:1-9"
                    break;
                case "4":
                    userData = await User.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ id: -1 })
                    Sort = "id:9-1"
                    break;
                default:
                    console.log(search);
                    userData = await User.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ id: 1 })
                    Sort = "sort by"
                    break;
            }
        }
        res.render('customerPage', { userData: userData, Sort: Sort });
    } catch (error) {
        console.log(error.message)
    }
}

const customerDetails = async (req, res) => {
    try{
        const id = req.query.id;
        const details = await User.findOne({_id:id});
        console.log(details)
        res.render('customerdetails',{details:details})
    }catch(error){
        console.log(error.message);
    }
}


const sample = async (req, res) => {
    try {
        res.render("sample");
    } catch (error) {
        console.log(error.message)
    }
}

const ordersLoad = async (req, res) => {
    try{
        let search;
        search = ''
        if (req.query.text) {
            search = req.query.text;
        }

        console.log(search);
        let orderData;
        let Sort;
        
        // const orders = await Order.find().populate("productId").populate("customer_id")
        // console.log(orders);
        


        if (req.query) {

            const sort = req.query.sort
            switch (sort) {
                
                case "1":
                    orderData = await Order.find({
                        $or: [
                            { orderId: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).populate("productId").populate("customer_id").sort({ orderId: 1 })
                    Sort = "id:1-9"
                    break;
                case "2":
                    orderData = await Order.find({
                        $or: [
                            { orderId: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).populate("productId").populate("customer_id").sort({ orderId: -1 })
                    Sort = "id:9-1"
                    break;
                default:
                    console.log(search);
                    orderData = await Order.find({
                        $or: [
                            { orderId: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).populate("productId").populate("customer_id").sort({ orderId: 1 })
                    Sort = "sort by"
                    break;
            }
        }
        console.log("OrderData: ", orderData);
        
        res.render('ordersPage', { orderData: orderData, Sort: Sort });
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    customersLoad,
    customerDetails,
    ordersLoad,
    sample
}