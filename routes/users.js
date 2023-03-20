var express = require('express');
var router = express.Router();
const producthelpers = require('../helpers/producthelpers');

/* GET home page. */
router.get('/', function (req, res, next) {

  producthelpers.getAllProducts().then((products) => 
  {
    res.render('user/view-products', { admin: true, products })

  }
  )
});

module.exports = router;
