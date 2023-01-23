const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');

exports.categoryList = (req, res, next) => {
  Category.find()
  .sort({ name: 1 })
  .exec(function(err, results){
    if(err){
      return next(err);
    }
    res.render('category_list', {
      title: 'Categorias',
      categories: results
    });
  });
}

exports.categoryDetail = (req, res, next) => {
  async.parallel(
    {
      category(callback){
        Category.findById(req.params.id).exec(callback);
      },
      products(callback){
        Product.find({ category: req.params.id }, 'name').exec(callback);
      }
    },
    (err, results) => {
      if(err){
        return next(err);
      }
      if(results.category == null){
        const error = new Error('Categoria não encontrada');
        error.status = 404;
        return next(error);
      }
      res.render('category_detail', {
        category: results.category,
        products: results.products
      });
    }
  );
}

exports.categoryCreateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Category create GET');
}

exports.categoryCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Category create POST');
}

exports.categoryUpdateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update GET');
}

exports.categoryUpdatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update POST');
}

exports.categoryDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
}

exports.categoryDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
}