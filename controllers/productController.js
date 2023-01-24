const Product = require('../models/product');
const Category = require('../models/category');
const Supplier = require('../models/supplier');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = (req, res, next) => {
  async.parallel(
    {
      inStockProductCount(callback){
        Product.countDocuments({})
        .where('quantity')
        .gt(10)
        .exec(callback);
      },
      lowStockProductCount(callback){
        Product.countDocuments({})
        .where('quantity')
        .gt(0)
        .lte(10)
        .exec(callback);
      },
      outOfStockProductCount(callback){
        Product.countDocuments({})
        .where('quantity')
        .eq(0)
        .exec(callback);
      },
      productCount(callback){
        Product.countDocuments({}).exec(callback);
      },
      categoryCount(callback){
        Category.countDocuments({}).exec(callback);
      },
      supplierCount(callback){
        Supplier.countDocuments({}).exec(callback);
      }
    },
    (err, results) => {
      res.render('index', {
        title: 'Inventário',
        data: results,
        error: err
      });
    }
  );
}

exports.productList = (req, res, next) => {
  Product.find({}, "name price")
    .sort({ name: 1 })
    .exec(function(err, results){
      if(err){
        return next(err);
      }
      res.render('product_list', { 
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

exports.productUpdateGet = (req, res, next) => {
  async.parallel(
    {
      categories(callback){
        Category.find({}, 'name').exec(callback)
      },
      suppliers(callback){
        Supplier.find({}, 'name state city').exec(callback);
      },
      product(callback){
        Product.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if(err){
        return next(err);
      }
      if(results.product == null){
        const error = new Error('Produto não encontrado');
        error.status = 404;
        return next(error);
      }
      res.render('product_form', {
        title: 'Atualizar produto',
        categories: results.categories,
        suppliers: results.suppliers,
        product: results.product
      });
    }
  );
}

exports.productUpdatePost = [
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
      supplier: [req.body.supplier],
      _id: req.params.id
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
            title: 'Atualizar produto',
            categories: results.categories,
            suppliers: results.suppliers,
            errors: errors.array(),
            product
          });
          return;
        }

        Product.findByIdAndUpdate(req.params.id, product, {}, function(err, doc) {
          if(err){
            return next(err);
          }
          res.redirect(doc.url);
        });
      }
    );
  }
]

exports.productDeleteGet = (req, res, next) => {
  Product.findById(req.params.id, (err, product) => {
    if(err){
      return next(err);
    }
    if(product == null){
      const error = new Error('Produto não encontrado');
      error.status = 404;

      return next(error);
    }
    res.render('product_delete', {
      title: 'Excluir produto',
      product
    });
  });
}

exports.productDeletePost = (req, res, next) => {
  Product.findByIdAndRemove(req.params.id, {}, (err) => {
    if(err){
      return next(err);
    }
    res.redirect('/inventory/products');
  })
}