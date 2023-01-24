const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');
const {body, validationResult} = require('express-validator');

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

exports.categoryCreateGet = (req, res, next) => {
  res.render('category_form', { title:'Adicionar categoria' });
}

exports.categoryCreatePost = [
  body('name', 'Campo nome não deve ser vazio.')
    .trim()
    .isLength({ min:1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    const category = new Category({
      name: req.body.name
    });

    if(!errors.isEmpty()){
      res.render('category_form', {
        title: 'Adicionar categoria',
        errors: errors.array(),
        category
      });
      return;
    }

    category.save((err) => {
      if(err){
        return next(err);
      }
      res.redirect(category.url);
    });
  }
]

exports.categoryUpdateGet = (req, res, next) => {
  Category.findById(req.params.id, (err, category) => {
    if(err){
      return next(err);
    }
    if(category == null){
      const error = new Error('Categoria não encontrada');
      error.status = 404

      return next(error);
    }

    res.render('category_form', {
      title: 'Atualizar categoria',
      category
    });
  });
}

exports.categoryUpdatePost = [
  body('name', 'Campo nome não deve ser vazio.')
    .trim()
    .isLength({ min:1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    const category = new Category({
      name: req.body.name,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      res.render('category_form', {
        title: 'Atualizar categoria',
        errors: errors.array(),
        category
      });
      return;
    }

    Category.findByIdAndUpdate(req.params.id, category, {}, function(err, doc) {
      if(err){
        return next(err);
      }
      res.redirect(doc.url);
    })
  }
]

exports.categoryDeleteGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
}

exports.categoryDeletePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
}