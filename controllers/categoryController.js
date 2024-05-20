const express = require("express");
const app = express();
const Category = require('../models/categoryModel');

// category page view

const categoryLoad = async (req, res) => {
    try {
        let search;
        search = ''
        if (req.query.text) {
            search = req.query.text;
        }
        console.log(search);
        let categoryData;
        let Sort;


        if (req.query) {

            const sort = req.query.sort
            switch (sort) {
                case "1":
                    categoryData = await Category.find({
                        status: "list",
                        $or: [
                            { category_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }

                        ]
                    }).sort({ category_name: 1 });
                    Sort = "name:A-Z";
                    break;
                case "2":
                    categoryData = await Category.find({
                        $or: [
                            { category_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ category_name: -1 })
                    Sort = "name:Z-A";
                    break;
                case "3":
                    categoryData = await Category.find({
                        $or: [
                            { category_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ created_on: 1 })
                    Sort = "newest"
                    break;
                case "4":
                    categoryData = await Category.find({
                        $or: [
                            { category_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ created_on: -1 })
                    Sort = "oldest"
                    break;
                default:
                    console.log(search);
                    categoryData = await Category.find({
                        $or: [
                            { category_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ category_name: 1 })
                    Sort = "sort by"
            }
        }

        // console.log(categoryData)
        // res.render('productBrowse',{Products:productData});
        res.render('categoryPage', { Category: categoryData, Sort: Sort });

    } catch (error) {
        console.log(error.message);
    }
}

// add new category page view

const addCategory = async (req, res) => {
    try {
        res.render('addCategory');
    } catch (error) {
        console.log(error.message);
    }
}

// add new category

const insertCategory = async (req, res) => {
    try {
        const { categoryName, categoryStatus, description } = req.body;
        const categoryData = await Category.findOne({ category_name: categoryName });
        if (categoryData) {
            res.render('addCategory', { message: "Catergory already Exists...", categoryName: categoryName, description: description })
        } else {
            category = new Category({
                category_name: categoryName,
                status: categoryStatus,
                description: description,
                created_on: new Date()
            });
            const categoryData = await category.save()
            if (categoryData) {
                res.redirect('/admin/admin_panel/category');
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editCategory = async (req, res) => {
    try {
        const id = req.query.id
        const categoryData = await Category.findOne({ _id: id })
        console.log(categoryData);

        res.render('editCategory', { category: categoryData });
    } catch (error) {
        console.log(error.message);
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id, categoryName, categoryStatus, description } = req.body
        const CategoryData = await Category.findByIdAndUpdate({ _id: id },
            {
                $set: {
                    category_name: categoryName,
                    status: categoryStatus,
                    description: description,
                    updated_on: new Date()
                }
            });
        if (CategoryData) {
            console.log("updated successfully")
        }
        res.redirect('/admin/admin_panel/category')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    categoryLoad,
    addCategory,
    insertCategory,
    editCategory,
    updateCategory
}