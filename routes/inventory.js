const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const supplierController = require('../controllers/supplierController');
const productController = require('../controllers/productController');

// Category routes

router.get('/', productController.index);

router.get('/category/create', categoryController.categoryCreateGet);

router.post('/category/create', categoryController.categoryCreatePost);

router.get('/category/:id/update', categoryController.categoryUpdateGet);

router.post('/category/:id/update', categoryController.categoryUpdatePost);

router.get('/category/:id/delete', categoryController.categoryDeleteGet);

router.post('/category/:id/delete', categoryController.categoryDeletePost);

router.get('/category/:id', categoryController.categoryDetail);

router.get('/categories', categoryController.categoryList);

// Product routes

router.get('/product/create', productController.productCreateGet);

router.post('/product/create', productController.productCreatePost);

router.get('/product/:id/update', productController.productUpdateGet);

router.post('/product/:id/update', productController.productUpdatePost);

router.get('/product/:id/delete', productController.productDeleteGet);

router.post('/product/:id/delete', productController.productDeletePost);

router.get('/product/:id', productController.productDetail);

router.get('/products', productController.productList);


// Supplier routes

router.get('/supplier/create', supplierController.supplierCreateGet);

router.post('/supplier/create', supplierController.supplierCreatePost);

router.get('/supplier/:id/update', supplierController.supplierUpdateGet);

router.post('/supplier/:id/update', supplierController.supplierUpdatePost);

router.get('/supplier/:id/delete', supplierController.supplierDeleteGet);

router.post('/supplier/:id/delete', supplierController.supplierDeletePost);

router.get('/supplier/:id', supplierController.supplierDetail);

router.get('/suppliers', supplierController.supplierList);

module.exports = router;