const Supplier = require('../models/supplier');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.supplierList = (req, res, next) => {
  Supplier.find({}, 'name state')
    .exec(function(err, result) {
      if(err){
        return next(err);
      }
      res.render('supplier_list', {
        title: 'Fornecedores',
        supplier_list: result
      });
    });
}

exports.supplierDetail = (req, res, next) => {
  async.parallel(
    {
      supplier(callback){
        Supplier.findById(req.params.id).exec(callback);
      },
      products(callback){
        Product.find({ supplier: req.params.id }, 'name').exec(callback);
      }
    },
    (err, results) => {
      if(err){
        next(err);
      }
      if(results.supplier == null){
        const error = new Error('Fornecedor não encontrado');
        error.status = 404;

        return next(error);
      }
      res.render('supplier_detail', {
        supplier: results.supplier,
        supplier_products: results.products
      });
    }
  );
}

exports.supplierCreateGet = (req, res) => {
  res.render('supplier_form', { title: 'Adicionar fornecedor' });
}

exports.supplierCreatePost = [
  body('name', 'Campo nome não deve ser vazio.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('cnpj', 'Campo CNPJ deve conter 14 caracteres')
    .trim()
    .isLength({ min: 14, max: 14 })
    .escape(),
  body('city', 'Nome de cidade inválido')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('state', 'Campo estado não deve ser vazio.')
    .trim()
    .isLength({ min:2 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const supplier = new Supplier({
      name: req.body.name,
      cnpj: req.body.cnpj,
      city: req.body.city,
      state: req.body.state
    });

    if(!errors.isEmpty()){
      res.render('supplier_form', {
        title: 'Adicionar fornecedor',
        errors: errors.array(),
        supplier
      });
      return;
    }

    supplier.save((err) => {
      if(err){
        return next(err);
      }
      res.redirect(supplier.url);
    });
  }
];

exports.supplierUpdateGet = (req, res, next) => {
  Supplier.findById(req.params.id, (err, supplier) => {
    if(err){
      return next(err);
    }
    if(supplier == null){
      const error = new Error('Fornecedor não encontrado');
      error.status = 404;

      return next(error);
    }

    res.render('supplier_form', {
      title: 'Atualizar fornecedor',
      supplier
    });
  });
}

exports.supplierUpdatePost = [
  body('name', 'Campo nome não deve ser vazio.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('cnpj', 'Campo CNPJ deve conter 14 caracteres')
    .trim()
    .isLength({ min: 14, max: 14 })
    .escape(),
  body('city', 'Nome de cidade inválido')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('state', 'Campo estado não deve ser vazio.')
    .trim()
    .isLength({ min:2 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const supplier = new Supplier({
      name: req.body.name,
      cnpj: req.body.cnpj,
      city: req.body.city,
      state: req.body.state,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      res.render('supplier_form', {
        title: 'Atualizar fornecedor',
        errors: errors.array(),
        supplier
      });
      return;
    }

    Supplier.findByIdAndUpdate(req.params.id, supplier, {}, function(err, doc){
      if(err){
        return next(err);
      }
      res.redirect(doc.url);
    });
  }
]

exports.supplierDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier delete GET');
}

exports.supplierDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier delete POST');
}