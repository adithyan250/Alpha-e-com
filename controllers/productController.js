const userModel = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require("../models/categoryModel");
const Subcategory = require('../models/subCategoryModel.js')
const express = require("express");
const app = express();

// add product 

const addProduct = async (req, res) => {
    try {
        let arrImg = [];
        const productCount = await Product.count()
        const id = productCount + 1;
        console.log(productCount)
        const { title,subCategory, category, brand, model, price, description } = req.body
        for (let i = 0; i < req.files.length; i++) {
            arrImg[i] = req.files[i].filename;
            console.log(req.files[i].filename)
        }
        console.log(category)
        
        const product = new Product({
            id: id,
            title: title,
            category: category,
            subcategory:subCategory,
            brand: brand,
            model: model,
            price: price,
            images: arrImg,
            description: description,
            created_on: new Date(),
        })
        const product_data = await product.save()
        res.redirect('/admin/admin_panel')
    } catch (error) {
        console.log(error.message);
    }
}

// add product page 

const addProductLoad = async (req, res) => {
    try {
        const category = await Category.find();
        res.render('addProduct', { cat: category });
    } catch (error) {
        console.log(error.message)
    }
}

// subcategory load with ajax

const subcategoryDataLoad = async (req, res) => {
    try {
        const cat = req.query.cat
        const subcat = await Subcategory.find({ category_id: cat });
        res.json(subcat);
    } catch (error) {
        console.log(error.message);
    }
}

// browse the products

const browseProducts = async (req, res) => {
    try {
        var search = '';
        var category = req.body.category
        console.log(req.body.search)
        if (req.body.search) {
            search = req.body.search
        }

        const productData = await Product.find({
            $or: [
                { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                { description: { $regex: '.*' + search + '.*', $options: 'i' } },
                { title: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        });
        res.render('productBrowse', { Products: productData, search: search });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

// view product 

const productView = async (req, res) => {
    try {
        const id = req.query.id;
        const productData = await Product.findById({ _id: id });
        if (productData) {
            res.render('productView', { product: productData })
        } else {
            res.redirect('/product_browse');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const productLoad = async (req, res) => {
    try {

        let search;
        search = ''
        if (req.query.text) {
            search = req.query.text;
        }

        console.log(search);
        let productsData;
        let Sort;

        if (req.query) {

            const sort = req.query.sort
            switch (sort) {
                case "1":
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }

                        ]
                    }).sort({ title: 1 });
                    Sort = "name:A-Z";
                    break;

                case "2":
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ title: -1 })
                    Sort = "name:Z-A";
                    break;
                case "3":
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ created_on: 1 })
                    Sort = "newest"
                    break;

                case "4":
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ created_on: -1 })
                    Sort = "oldest"
                    break;

                case "5":
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ id: 1 })
                    Sort = "id:1-9"
                    break;

                case "6":
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ id: -1 })
                    Sort = "id:9-1"
                    break;

                default:
                    console.log(search);
                    productsData = await Product.find({
                        $or: [
                            { id: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { brand: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { model: { $regex: '.*' + search + '.*', $options: 'i' } },
                            { description: { $regex: '.*' + search + '.*', $options: 'i' } }
                        ]
                    }).sort({ id: 1 })
                    Sort = "sort by"
                    break;
            }
        }

        // console.log(categoryData)
        // res.render('productBrowse',{Products:productData});
        // res.render('categoryPage', { Category: categoryData, Sort: Sort });
        res.render('productPage', { Product: productsData, Sort: Sort });
    } catch (error) {
        console.log(error.message);
    }
}

const editProductLoad = async (req, res) => {
    try {
        const id = req.query.id
        const productData = await Product.findOne({ _id: id });
        const category = await Category.find();
        // let category = [];
        // for(let i = 0; i < categoryData.length; i++){
        //     category[i] = categoryData[i].category_name;
        // } 
        console.log(category);
        res.render('editProducts', { product: productData, category: category });
    } catch (error) {
        console.log(error.message);

    }
}

const updateProduct = async (req, res) => {
    try {
        // let arrImg = [];
        const { title, id, category, brand, model, price, description, stock, discount, status } = req.body
        // for(let i=0; i<req.files.length; i++){
        //     arrImg[i] = req.files[i].filename;
        // }
        console.log(req.body)
        const ProductUpdate = await Product.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    title: title,
                    category: category,
                    brand: brand,
                    model: model,
                    price: price,
                    stocks: stock,
                    discount: discount,
                    status: status,
                    description: description,
                    updated_on: new Date()
                }
            }
        );
        if (ProductUpdate) {
            console.log("updated successfully")
            res.redirect('/admin/admin_panel/products')
        } else {
            res.redirect('/admin_panel/products/edit_product');
        }

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    productLoad,
    addProduct,
    addProductLoad,
    browseProducts,
    productView,
    editProductLoad,
    updateProduct,
    subcategoryDataLoad
}