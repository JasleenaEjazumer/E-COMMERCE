const { response } = require('express');
var express = require('express');
var router = express.Router();
const producthelpers = require('../helpers/producthelpers');
const userHelpers = require('../helpers/user-helpers');
const { PRODUCT_COLLECTION } = require('../config/collections');


const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect("/login")
  }
} 
/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  console.log('user');
  let cartCount=null
  if(req.session.user){

    cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  producthelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user ,cartCount})

  }
  )
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn)
   {
    res.redirect('/')
  } else
    res.render('user/login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn = true
      req.session.user = response
    res.redirect('/login')
  })

})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid user name or password"
      res.redirect('/login')
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
  let totalValue=0
  if(products.length>0){
 totalValue=await userHelpers.getTotalamount(req.session.user._id)
  }else{
    res.render('user/cartempty')
  }

  console.log(products);
let user=req.session.user._id
console.log(user);
  res.render('user/cart',{products,user:req.session.user._id,totalValue})
})
router.get('/add-to-cart/:id/',(req,res)=>{
  
  console.log("api call");
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
    //res.redirect('/')
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.getTotalamount(req.body.user)
    res.json(response)
    
  })
})
router.post('/remove-product',(req,res)=>{
  console.log(req.body);
  userHelpers.RemoveProduct(req.body).then((response)=>{
    res.json(response)
  })

})
router.get('/place-order',verifyLogin,async(req,res)=>{
  console.log("api call");
  let total=await userHelpers.getTotalamount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
})
router.post('/place-order',async(req,res)=>{
  console.log("api call");
  let  products=await userHelpers.getCartProductList(req.session.user._id)
  let totalprice=await userHelpers.getTotalamount(req.body.userId)
  userHelpers.placeorder(req.body,products,totalprice).then((orderId)=>{
  console.log(orderId);
  
    if(req.body['payment-method']==='COD'){
res.json({codsucces:true})
    }
    else{
      userHelpers.generateRazorpay(orderId,totalprice).then((response)=>{
res.json(response)
      })
    }
  })
console.log(req.body);
})
router.get('/order-succes',(req,res)=>{
  res.render('user/ordersucces',{user:req.session.user})
})
router.get('/vieworder',async(req,res)=>{
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/view-order',{user:req.session.user,orders})
})
router.get('/view-order-products/:id',async(req,res)=>{
  let products=await userHelpers.getOrderproducts(req.params.id)
  console.log(products);

  res.render('user/view-order-product',{user:req.session.user,products})
})
router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(()=>{
userHelpers.changepaymentstatus(req.body['order[receipt]']).then(()=>{
  res.json({status:true})
})
  }).catch((err)=>{
    console.log(err);
    res.json({status:'false',errMsg:''})

  })
})


module.exports = router;
