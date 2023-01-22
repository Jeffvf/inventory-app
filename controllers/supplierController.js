const Supplier = require('../models/supplier');
const Product = require('../models/product');
const async = require('async');

exports.supplierList = (req, res, next) => {
  Supplier.find({}, 'name state')
    .exec(function(err, result) {
      if(err){
        return next(err);
      }
      res.render('supplier_list', {
        title: 'Supplier List',
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
        const error = new Error('Supplier not found');
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
  res.send('NOT IMPLEMENTED: Supplier create GET');
}

exports.supplierCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier create POST');
}

exports.supplierUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier update GET');
}

exports.supplierUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier update POST');
}

exports.supplierDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier delete GET');
}

exports.supplierDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Supplier delete POST');
}