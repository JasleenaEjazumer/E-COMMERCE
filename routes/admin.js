const { Router } = require('express');
var express = require('express');
const productHelpers = require('../helpers/producthelpers');
var router = express.Router();


// const adminSchema = new mongoose.Schema({
//   username: String,
//   password: String
// });

// const Admin = mongoose.model('Admin', adminSchema);
const verifyLogin=(req,res,next)=>{
  if(req.session.admin.loggedIn){
    next()
  }else{
    res.redirect("/login")
  }
} 

/* GET users listing. */
router.get('/', function (req, res, next) {

  let admin = req.session.admin
  console.log('admin');
  if(req.session.admin){
  productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products', {  products }) 
  })  
}else{

    res.render('admin/login')
  } 
});
router.get('/add-product', function (req, res) {
  res.render("admin/add-product")
})

// router.get('register',(req,res) => {
//   res.render('admin/register',{admin:true})
// })

// router.post('/register',(req,res) => {
//   productHelpers.doRegister(req.body).then((response) => {
//     res.redirect('/admin')
//   })
// })

router.get('/login', (req, res) => {
   if (req.session.admin)
   {
    res.redirect('/')
  } else
    res.render('admin/login', {admin:true, "loginErr": req.session.userloginErr })
    req.session.userloginErr = false
  
})


router.post('/login', (req, res) => {
  console.log(req.body);
  productHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      res.redirect('/admin')
    } else {
      req.session.adminloginErr = "Invalid user name or password"
      res.redirect('/admin/login')
    }
  })
router.get('/logout', (req, res) => {
  req.session.admin=null
  res.redirect('/')
})

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
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image;
      image.mv("./public/product-images/" + id + ".jpg")
        }
    })
  
})
module.exports = router;
