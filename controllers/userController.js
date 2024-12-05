if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const express = require("express");
const app = express();
const otpGenerator = require('otp-generator');

const config = require('../config/config');

const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

app.use((req, res, next)=>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires','-1');
    res.header('Pragma', 'no-cache');
    next();
});

// user password hashing

const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}



// user verify email
var OTP;

const sendVerifyMail = async(name, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });

        OTP = otpGenerator.generate(6,{ upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true});

        const mailoption = {
            from:'adithyanpb339@gmail.com',
            to:email,
            subject:'Email Verification',
            text:`Hello ${name}, Your OTP for verify your Email is ${OTP}`
        }
        transporter.sendMail(mailoption, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log("Email has been sent: ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

// user registration page view

const loadRegister = async(req,res) => {
    try{
        res.render('registration');
    }catch(error){
        console.log(error.message);
    }
}

// user resgistration

var user;


const insertUser = async(req,res)=>{
    try{
        const {name, email, phone, password, confirmPassword} = req.body
        const spassword = await securePassword(password);
        const dataEmail = await User.findOne({email:email});
        const dataPhone = await User.findOne({mobile:phone});
        if(password === confirmPassword) {
            if(dataEmail || dataPhone){
            
                res.render('registration',{message:"Mobile number or Email are already used...",name:name, email:email, phone:phone, password:password, confirmPassword:confirmPassword})
            }else {
                let users = await User.find()
                let id = users.length+1
                id = id.toString()
                user = new User({
                    name:name,
                    email:email,
                    mobile:phone,
                    password:spassword,
                    is_admin:0,
                    id: id,
                    status: 'true'
                });
                const userData = await user.save()
                if(userData){
                    sendVerifyMail(name, email);
                    res.redirect('/email_verification');
                }else{
                    res.render('registration',{message:"Your registration has been Failed",name:name, email:email, phone:phone, password:password, confirmPassword:confirmPassword})
                }
            }
        }else{
            res.render('registration',{message:"Confirm Password is not matching",name:name, email:email, phone:phone, password:password, confirmPassword:confirmPassword})
        }
    }catch (error){
        console.log(error.message)
    }
}

// otp verification

const verifyOTP = async (req, res)=>{
    try {
        const {otp, email} = req.body;
        if(otp===OTP){
            const updateInfo = await User.updateOne({email:email},{$set:{is_verified:1}});
            res.redirect('/user_signin');
        }else{
            res.render('emailVerification', {message:"Invalid OTP",otp:otp,email:email});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


//login page view

const loginload = async(req, res) => {
    try {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

// user login verification

const  verifyLogin = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email:email});
        // console.log(userData)
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                if(userData.is_verified === 1){
                    req.session.user_id = userData._id;
                    console.log(req.session.user_id);
                    res.redirect('/home');
                }else{
                    res.render('login',{message:"Please verify your Email!!..", email:email, password:password})
                }
            }else{
                res.render('login',{message:"Email and password is Inncorrect", email:email, password:password})
            }
        }else{
            res.render('login',{message:"Email and password is Inncorrect", email:email, password:password})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// user home 

const loadHome = async(req, res) => {    
    try {   
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires','-1');
        res.header('Pragma', 'no-cache');
        console.log(req.session);
        const userData = await User.findById({_id:req.session.user_id});
        const productData  = await Product.find().sort({created_on:1}).limit(8)
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        // console.log(JSON.stringify(footer, null, 2));
        res.render('home',{products: productData, category: footer, user: userData}); 
    } catch (error) {
        console.log(error.message);
    }
}

// user Logout 

const userLogout = async(req, res) => {
        
    try {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires','-1');
        res.header('Pragma', 'no-cache');
        req.session.destroy();
        res.redirect('/user_signin');
    } catch (error) {
        console.log(error.message);
    }
}

// emailVerification

const emailVerification = async (req, res)=>{
    try{
        res.render('emailVerification',{email:user.email});
    } catch (error) {
        console.log(error.message) 
    }
}

// email entering page for email verification

const emailEntry = async (req, res) => {
    try {
        res.render('enterEmail')
    } catch (error) {
        console.log(error.message);
    }
}

// email verification

const verifyEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            if(userData.is_verified === 1){
                res.render('enterEmail', {message:"This Email is already verified..",email:email});
            }else{
                sendVerifyMail(userData.name, userData.email);
                res.render('emailVerification',{email:email});
            }
        }else{
            res.render('enterEmail',{message:"Email is not exists... ",email:email})
        }
    } catch (error) {
        console.log(error.message)
    }
};

const emailVerifyResendOtp = async (req, res) => {
    try {
        const email = req.query.email;
        const userData = await User.findOne({email:email});
        if(userData.email){
            sendVerifyMail(userData.name, userData.email);
            res.render('emailVerification',{email:email});
        }
    } catch (error) {
        console.log(error.message)
    }
}



// email entering page view

const emailEntryForgotPassword = async (req, res) => {
    try {
        res.render("emailEntryForgotPassword")
    } catch (error) {
        console.log(error.message);
    }
}

// otp email sent for forget password

const forgotPasswordOtp = async(name, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });

        OTP = otpGenerator.generate(6,{ upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true});

        const mailoption = {
            from:'adithyanpb339@gmail.com',
            to:email,
            subject:'Forget Password',
            // text:`Hello ${name}, Your OTP for verify your Email is ${OTP}`
            html:`<div style="margin: 24px auto ;">
            <table cellpadding="0" cellspacing="0" style="font-family: DM Sans, sans-serif; font-size: 16px; font-weight: 400; width: 600px; border: none; margin: 0 auto; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">
                <thead style="padding: 16px; display: block;">
                    <tr style="display: block; border: none; text-align: center; font-size: 24px; letter-spacing: 1px;">
                        <th scope="col" style="margin: auto; display: block;">Alpha E-com</th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr>
                        <td style="background-color: #f8fafc; padding: 16px; display: block; text-align: center;">
                            <h2 style="font-weight: 600;">Reset Password</h2>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 16px 16px 0; color: #161c2d;">
                            <p style="margin: 0; font-size: 18px; font-weight: 500;">Hello, ${name}</p>
                            <p style="margin-bottom: 0; color: #94a3b8;">Your One Time Password(OTP) is :</p>
                        </td>
                    </tr>
    
                    <tr>
                        <td style="padding: 16px 16px 0;">
                            <p style="margin: 0; font-size: 18px; font-weight: 500;">${OTP}</p>
                        </td>
                    </tr>
    
                    <tr>
                        <td style="padding: 16px 16px 0; color: #94a3b8;">
                            Your OTP will expire in 15 min.
                        </td>
                    </tr>
    
                    <tr>
                        <td style="padding: 16px;">
                            <p style="margin: 0; font-size: 18px; font-weight: 500;">Warm Regards, <br>Alpha E-com <br> Support Team</p>
                        </td>
                    </tr>
    
                    <tr>
                        <td style="padding: 16px 8px; color: #fff; background-color: #161c2d; text-align: center;">
                            <table style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <td style="display: inline-flex; align-items: center; margin: 0 10px 10px;">
                                            <span style="font-size: 14px;">Free delivery</span>
                                        </td>
                    
                                        <td style="display: inline-flex; align-items: center; margin: 0 10px 10px;">
                                            <span style="font-size: 14px;">Money-back quarantee</span>
                                        </td>
                    
                                        <td style="display: inline-flex; align-items: center; margin: 0 10px 10px;">
                                            <span style="font-size: 14px;">Secure payments</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="text-align: center;">
                                            <p style="margin: 4px 0 10px;">© <script>document.write(new Date().getFullYear())</script> Cartzio. Designed by <a href="https://shreethemes.in/" target="_blank" style="text-decoration: none; color: #fff;">Shreethemes</a>.</p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="text-align: center;">
                                            <a href="#" target="_blank" style="color: #ea580c;">Unsubscribe</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`
        }
        transporter.sendMail(mailoption, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log("Email has been sent: ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

// get email for otp sent

const getEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            forgotPasswordOtp(userData.name, userData.email);
            // console.log(OTP)
            res.redirect(`/forgot_password_otp?email=${email}`);
        }else{
            res.render("emailEntryForgotPassword",{email:email, message:"The Email is not existed...."})
        }

    } catch (error) {
        console.log(error.message)
    }
}

// resend otp

const resendotp = async (req, res) => {
    try {
        const email = req.query.email;
        const userData = await User.findOne({email:email});
        if(userData){
            forgotPasswordOtp(userData.name, userData.email);
            // console.log(OTP)
            res.redirect(`/forgot_password_otp?email=${email}`);
        }else{
            res.render("emailEntryForgotPassword",{email:email, message:"The Email is not existed...."})
        }
    } catch (error) {
        console.log(error.message)
    }
}

// otp entering page view

const forgetPasswordOtp = async (req, res) => {
    try {
        res.render('enterOtp',{email:req.query.email})
    } catch (error) {
        console.log(error.message);
    }
}

// otp checking

const forgetPasswordOtpVerify = async (req, res) => {
    try {
        const {otp,email} = req.body;
        // console.log(email)
        // console.log(otp)
        if(OTP===otp){
            res.render("enterpassword",{email:email});
        }
    } catch (error) {
        console.log(error.message)
    }
}

// update Password

const newPassword = async (req, res) => {
    try {
        const {password,confirmPassword,email} = req.body
        // console.log(password,confirmPassword,email)

        if(password === confirmPassword){
            const spassword = await securePassword(password);
            const passwordData = await User.findOneAndUpdate(
                {email:email},
                {$set:
                    {
                        password:spassword
                    }
                 },
                {new:true}
            )
            // console.log(passwordData)
            if(passwordData){
                res.redirect('/user_signin');
            }else{
                res.render('enterpassword', {confirmPassword:confirmPassword, password:password,message:"Email is not found"})
            }
        }else{
            res.render('enterpassword', {confirmPassword:confirmPassword, password:password,message:"password and confirm password is not matching"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sample = async (req, res) => {
    try {
        if(req.body!=="undefined"){
            const {maxPrice, minPrice} = req.body;
            const products = await Product.find({price: {$gte: minPrice, $lte: maxPrice}})
        }
        const productData  = await Product.find().sort({created_on:1}).limit(8)
        const footer = await Category.aggregate([{$lookup:{from:"subcategories",localField:"category_id",foreignField:"category_id",as:"sub_cat"}},{$limit:2}]);
        res.render("smaple",{products:productData, category: footer});
    } catch (error) {
        console.log(error.message)
    }
}

//$2b$10$GPFPBdwD61XAhBBjBq/cUu.Uwq7HW0tm9XX1nponDS/1kEjsNgoFK
//*Chinnu#

module.exports = {
    loadRegister,
    insertUser,
    loginload,
    verifyLogin,
    loadHome,
    userLogout,
    emailVerification,
    verifyOTP,
    emailEntry,
    verifyEmail,
    emailEntryForgotPassword,
    getEmail,
    forgetPasswordOtp,
    forgetPasswordOtpVerify,
    newPassword,
    resendotp,
    emailVerifyResendOtp,
    sample
}