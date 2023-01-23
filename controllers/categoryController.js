const Category = require('../models/category');

exports.categoryList = (req, res, next) => {
  Category.find()
  .sort({ name: 1 })
  .exec(function(err, results){
    if(err){
      return next(err);
    }
    res.render('category_list', {
      title: 'Categories',
      categories: results
    });
  });
}

exports.categoryDetail = (req, res) => {
  res.send('NOT IMPLEMENTED: Category detail');
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