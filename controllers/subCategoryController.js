const express = require('express');
const app = express();
const Subcategory = require('../models/subCategoryModel.js')


const subcategoryload = async (req, res) => {
    try {
        let search;
        search = ''
        if (req.query.text) {
            search = req.query.text;
        }
        // console.log(search);
        let subCategoryData;
        let Sort;
        let cat_id = req.query.cat_id


        if (req.query) {

            const sort = req.query.sort
            
            switch (sort) {
                case "1":
                    subCategoryData = await Subcategory.find({
                        category_id: cat_id,
                        $or: [
                            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }

                        ]
                    }).sort({ subCategory_name: 1 });
                    Sort = "name:A-Z";
                    break;

                case "2":
                    subCategoryData = await Subcategory.find({
                        category_id: cat_id,
                        $or: [
                            { subCategory_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ subCategory_name: -1 })
                    Sort = "name:Z-A";
                    // console.log("2");
                    break;

                case "3":
                    subCategoryData = await Subcategory.find({
                        category_id: cat_id,
                        $or: [
                            { subCategory_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ created_on: 1 })
                    Sort = "newest"
                    break;

                case "4":
                    subCategoryData = await Subcategory.find({
                        category_id: cat_id,
                        $or: [
                            { categsubCategory_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ created_on: -1 })
                    Sort = "oldest"
                    break;

                default:
                    // console.log(search);
                    subCategoryData = await Subcategory.find({
                        category_id: cat_id,
                        $or: [
                            { subCategory_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ subCategory_name: 1 })
                    Sort = "sort by";
                    // console.log(typeof sort)
                    break;
            }
        }

        // console.log(subCategoryData)
        // res.render('productBrowse',{Products:productData});
        res.render('subcategory', { subcategory: subCategoryData, cat_id: cat_id, Sort: Sort });

    } catch (error) {
        console.log(error.message);
    }
}

const addSubCategory = async (req, res) => {
    try {
        let catid = req.query.cat_id;
        console.log(catid);
        res.render('addSubCategory', { catid: catid })
        // console.log(catid);
    } catch (error) {
        console.log(error.message);
    }
}

const insertSubCategory = async (req, res) => {
    try {
        const { subcategoryName, subcategoryStatus, description, catid } = req.body;
        const categoryData = await Subcategory.findOne({ subCategory_name: subcategoryName });
        if (categoryData) {
            res.render('addSubCategory', { message: "subcatergory already Exists...", subcategoryName: subcategoryName, description: description, catid: catid, categoryData: categoryData })
        } else {
            let count = await Subcategory.find({ category_id: catid }).countDocuments();
            // console.log(catid);
            count = count + 1
            subcategory = new Subcategory({
                subCategory_id: count,
                subCategory_name: subcategoryName,
                category_id: catid,
                status: subcategoryStatus,
                description: description,
                created_on: new Date()
            });
            const subcategoryData = await subcategory.save()
            if (subcategoryData) {
                res.redirect(`/admin/admin_panel/category/subcategory?cat_id=${catid}`);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editSubCategory = async (req, res) => {
    try {
        const { cat_id, subcat_id } = req.query
        const subcategoryData = await Subcategory.findOne({ subCategory_id: subcat_id });
        res.render('editsubcategory', { cat_id: cat_id, subcat_id: subcat_id, subcategory: subcategoryData });
    } catch (error) {
        console.log(error.message);
    }
}

const updateSubcategory = async (req, res) => {
    try {
        const { subcategoryName, cat_id, subcat_id, subcategoryStatus, description } = req.body;
        // const subcat_id = await Subcategory.findOne({
        const subcategoryData = await Subcategory.findOneAndUpdate({ subCategory_id: subcat_id },
            {
                $set: {
                    subCategory_name: subcategoryName,
                    status: subcategoryStatus,
                    description: description,
                    updated_on: new Date()

                }
            })
        if (subcategoryData) {

            res.redirect(`/admin/admin_panel/category/subcategory?cat_id=${cat_id}`);
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    subcategoryload,
    addSubCategory,
    insertSubCategory,
    editSubCategory,
    updateSubcategory
}