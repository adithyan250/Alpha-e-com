const express = require("express");
const app = express();
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

// category page view

const categoryLoad = async (req, res) => {
    try {
        let search;
        search = ''
        if (req.query.text) {
            search = req.query.text;
        }
        // console.log(search);
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
                    // console.log(search);
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
        const categories = await Category.find();
        const count = categories.length + 1;
        if (categoryData) {
            res.render('addCategory', { message: "Catergory already Exists...", categoryName: categoryName, description: description })
        } else {
            category = new Category({
                category_name: categoryName,
                status: categoryStatus,
                description: description,
                category_id: count,
                created_on: new Date()
            });
            const categoryData = await category.save();
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
        // console.log(categoryData);

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
            // console.log("updated successfully")
        }
        res.redirect('/admin/admin_panel/category')
    } catch (error) {
        console.log(error.message)
    }
}

const browseCategory = async (req, res) => {
    try {
        var search = '';
        // var category = req.body.category
        // console.log(req.query.category)
        if (req.query.category) {
            search = req.query.category
            // console.log(search)
        }
        let productData;
        let footer;
        let sort;
        if (req.query.maxPrice && req.query.minPrice) {
            // console.log("first")
            const { maxPrice, minPrice } = req.query;

            productData = await Product.find({
                $and: [
                    {
                        $or: [
                            { category: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    },
                    {
                        price: { $gte: minPrice, $lte: maxPrice }
                    }
                ]
            });
            if (req.query.sort) {
                sort = parseInt(req.query.sort, 10);
                // console.log(sort)
                switch (sort) {
                    case 1:
                        // console.log("eeojdja");
                        productData.sort((a, b) => {
                            let fa = a.title.toLowerCase(),
                                fb = b.title.toLowerCase();

                            if (fa < fb) {
                                return -1;
                            }
                            if (fa > fb) {
                                return 1;
                            }
                            return 0;
                        });
                        sort = "Name: A-Z";
                        break;
                    case 2:
                        productData.sort((a, b) => {
                            let fa = a.title.toLowerCase(),
                                fb = b.title.toLowerCase();

                            if (fa < fb) {
                                return 1;
                            }
                            if (fa > fb) {
                                return -1;
                            }
                            return 0;
                        });
                        sort = "Name: Z-A";
                        break;
                    case 3:
                        productData.sort((a, b) => a.price - b.price);
                        sort = "Price: Low-High";
                        break;
                    case 4:
                        productData.sort((a, b) => b.price - a.price);
                        sort = "Price: High-Low";
                        break;
                    default:
                        productData.sort((a, b) => a.title - b.title);

                }
            }
            // console.log(productData[0].category);
            footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
            res.render('productBrowse', { Products: productData, search: search, category: footer, maxPrice: maxPrice, minPrice: minPrice });
        } else {
            // console.log("second");
            productData = await Product.find({
                $or: [
                    { category: { $regex: '.*' + search + '.*', $options: 'i' } }
                ]
            });
            if (req.query.sort) {
                sort = parseInt(req.query.sort, 10);
                // console.log(sort)
                switch (sort) {
                    case 1:
                        // console.log("eeojdja");
                        productData.sort((a, b) => {
                            let fa = a.title.toLowerCase(),
                                fb = b.title.toLowerCase();

                            if (fa < fb) {
                                return -1;
                            }
                            if (fa > fb) {
                                return 1;
                            }
                            return 0;
                        });
                        sort = "Name: A-Z";
                        break;
                    case 2:
                        productData.sort((a, b) => {
                            let fa = a.title.toLowerCase(),
                                fb = b.title.toLowerCase();

                            if (fa < fb) {
                                return 1;
                            }
                            if (fa > fb) {
                                return -1;
                            }
                            return 0;
                        });
                        sort = "Name: Z-A";
                        break;
                    case 3:
                        productData.sort((a, b) => a.price - b.price);
                        sort = "Price: Low-High";
                        break;
                    case 4:
                        productData.sort((a, b) => b.price - a.price);
                        sort = "Price: High-Low";
                        break;
                    default:
                        productData.sort((a, b) => a.title - b.title);

                }
            }
            // console.log(productData[0].category);
            footer = await Category.aggregate([{ $lookup: { from: "subcategories", localField: "category_id", foreignField: "category_id", as: "sub_cat" } }, { $limit: 2 }]);
            res.render('productBrowse', { Products: productData, Sort: sort, search: search, category: footer });
        }
    } catch (error) {
        console.log(error.messsage);
    }
}

module.exports = {
    categoryLoad,
    addCategory,
    insertCategory,
    editCategory,
    updateCategory,
    browseCategory
}