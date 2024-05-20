const Banner = require('../models/bannerModel');
const express = require('express')
const app = express();


const bannerManage = async (req, res) => {
    try {
        const bannerData = await Banner.find();
        res.render('bannermanage', { banner: bannerData });
    } catch (error) {
        console.log(error.message);
    }
}

const addBanner = async (req, res) => {
    try {
        res.render('addbanner')
    } catch (error) {
        console.log(error.message);
    }
}

const insertBanner = async (req, res) => {
    try {
        const { link, description } = req.body
        const image = req.file.filename;
        const bannerCount = await Banner.count()
        const id = bannerCount + 1;
        const banner = new Banner({
            banner_id: id,
            image: image,
            link: link,
            description: description,
            created_on: new Date()
        });
        const bannerData = await banner.save();
        if (bannerData) {
            console.log("successfully uploaded")
            res.redirect('/admin/admin_panel/banner_manage')
        };

    } catch (error) {
        console.log(error.message);
    }
}

const editBanner = async (req, res) => {
    try {
        const id = req.query.id;
        const bannerData = await Banner.findOne({ banner_id: id });
        // console.log(bannerData);
        if (bannerData) {
            res.render('editBanner', { banner: bannerData });
        } else {
            console.log("edit Banner Data is not Exists");
            res.redirect("/admin/admin_panel/banner_manage")
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateBanner = async (req, res) => {
    try {
        // console.log(req.body.status);
        const { id, description, link } = req.body;
        let status;
        if (req.body.status === "true") {
            status = "listed";
        } else {
            status = "notListed";
        }
        const bannerData = await Banner.updateOne(
            {
                banner_id: id
            },
            {
                $set: {
                    link: link,
                    description: description,
                    status: status,
                    updated_on: new Date()
                }
            }
        );
        if(bannerData){
            res.redirect('/admin/admin_panel/banner_manage');
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    bannerManage,
    addBanner,
    insertBanner,
    editBanner,
    updateBanner
}