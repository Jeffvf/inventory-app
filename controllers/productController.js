const Product = require('../models/product');

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

exports.productCreateGet = (req, res) => {
  res.send('NOT IMPLEMENTED: Product create GET');
}

exports.productCreatePost = (req, res) => {
  res.send('NOT IMPLEMENTED: Product create POST');
}

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