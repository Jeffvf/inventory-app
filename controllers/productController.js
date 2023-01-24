const Product = require('../models/product');
const Category = require('../models/category');
const Supplier = require('../models/supplier');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.productList = (req, res, next) => {
  Product.find({}, "name price")
    .sort({ name: 1 })
    .exec(function(err, results){
      if(err){
        return next(err);
      }
      res.render('index', { 
        title: "Produtos",
        product_list: results 
      });
    })
}

exports.productDetail = (req, res, next) => {
  Product.findById(req.params.id)
    .populate('category')
    .populate('supplier')
    .exec(function(err, results) {
      if(err){
        return next(err);
      }
      if(results == null){
        const error = new Error('Produto não encontrado');
        error.status = 404;
        return next(error);
      }
      res.render('product_detail', {
        product: results
      });
    });
}

exports.productCreateGet = (req, res, next) => {
  async.parallel(
    {
      categories(callback){
        Category.find({}, 'name').exec(callback);
      },
      suppliers(callback){
        Supplier.find({}, 'name state city').exec(callback)
      }
    },
    (err, results) => {
      if(err){
        return next(err)
      }
      res.render('product_form', {
        title: 'Adicionar produto',
        categories: results.categories,
        suppliers: results.suppliers 
      });
    }
  );
}

exports.productCreatePost = [
  body('name', 'Nome de produto inválido')
  .trim()
  .isLength({ min: 3 })
  .escape(),
  body('description', 'Descrição inválida')
  .optional({ checkFalsy:true })
  .trim()
  .isLength({min: 3})
  .escape(),
  body('quantity', 'Quantidade inválida')
  .optional({ checkFalsy:true })
  .isNumeric()
  .escape(),
  body('price', 'Preço inválido')
  .isNumeric()
  .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category,
      supplier: [req.body.supplier]
    });

    if(req.body.supplier1)
      product.supplier.push(req.body.supplier1);
    if(req.body.supplier2){
      product.supplier.push(req.body.supplier2);
    }

    async.parallel(
      {
        categories(callback){
          Category.find({}, 'name').exec(callback);
        },
        suppliers(callback){
          Supplier.find({}, 'name state city').exec(callback)
        }
      },
      (err, results) => {
        if(err){
          return next(err);
        }
        if(!errors.isEmpty()){
          res.render('product_form', {
            title: 'Adicionar produto',
            categories: results.categories,
            suppliers: results.suppliers,
            errors: errors.array(),
            product
          });
          return;
        }

        product.save((err) => {
          if(err){
            return next(err);
          }
          res.redirect(product.url)
        });
      }
    );
  }
]

exports.productUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Product update GET');
}

exports.productUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Product update POST');
}

exports.productDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete GET');
}

exports.productDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete POST');
}