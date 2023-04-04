const { Router } = require('express');
var express = require('express');
const productHelpers = require('../helpers/producthelpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {


  productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products', {  products }) 
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
router.get('/delete-product/:id',(req,res)=>{
  let prodId=req.params.id
  console.log(prodId);
  productHelpers.deleteProduct(prodId).then((response)=>{
    res.redirect('/admin/')
  })
})


module.exports = router;
