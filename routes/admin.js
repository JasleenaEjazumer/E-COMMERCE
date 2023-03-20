const { Router } = require('express');
var express = require('express');
const productHelpers = require('../helpers/producthelpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {


  productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products', { admin:true, products }) 
  })
  
});


router.get('/add-product', function (req, res) {
  res.render("admin/add-product")
})

router.post("/add-product", (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/add-product");
      }
    });
  });
});



module.exports = router;