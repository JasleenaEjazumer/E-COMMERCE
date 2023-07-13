var db = require('../config/connection')
var collection = require('../config/collections');
const bcrypt = require('bcrypt')
const { response } = require('express');
var objectId = require("mongodb").ObjectId;
module.exports =
{

    addProduct: (products, callback) => {

        db.get().collection('product').insertOne(products).then((data) => {

            callback(data.insertedId)
        })
    },
    // doRegister:(adminData) => {
    //   return new Promise(async(resolve,reject) => {
    //     adminData.password = await bcrypt.hash(adminData.password,10)
    //     db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
    //       resolve(data.insertedId)
    //     })
    //   })
    // },

    // doLogin: (adminData) => {
    //     return new Promise(async (resolve, reject) => {
    //       let loginStatus = false
    //       let response = {}
    //       let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
    //       console.log('itth admin',admin)
    //       console.log(adminData)
    //       if (admin) {
    //         bcrypt.compare(adminData.Password, admin.Password).then((status) => {
    //           if (status) {
    //             console.log("login success")     
    //             response.admin = admin
    //             response.status = true
    //             resolve(response)
    //           } else {
    //             console.log('login failed')
    //             resolve({ status: false })
    //           }
    //         })
    //       } else {
    //         console.log('user login failed');
    //         resolve({ status: false })
    //       }
    
    //     })
    //   },
    

// doLogin: (adminData) => {
//   return new Promise(async (resolve, reject) => {
//     let loginStatus = false;
//     let response = {};

//     // Assuming you have manually inserted the admin credentials in the collection
//     const adminEmail = 'ejazumer01@gmail.com';
//     const adminPassword = '123';

//     if (adminData.Email === adminEmail) {
//       bcrypt.compare(adminData.Password, adminPassword).then((status) => {
//         if (status) {
//           console.log("Login success");
//           response.admin = { Email: adminEmail }; // You can include additional admin data if needed
//           response.status = true;
//           resolve(response);
//         } else {
//           console.log("Login failed");
//           resolve({ status: false });
//         }
//       });
//     } else {
//       console.log("Login failed");
//       resolve({ status: false });
//     }
//   });
// },

      doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
          let loginStatus = false
          let response = {}
          
          // Assuming you have manually inserted the admin credentials in the collection
          const adminEmail = 'ejazumer01@gmail.com';
          const adminPassword = '123';
          
          if (adminData.Email === adminEmail && adminData.Password === adminPassword) {
            console.log("Login success");
            response.admin = { Email: adminEmail }; // You can include additional admin data if needed
            response.status = true;
            resolve(response);
          } else {
            console.log("Login failed");
            resolve({ status: false });
          }
        });
      },
      

    getAllProducts: () => {
        return new Promise(async(resolve, reject) => {

           let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
      })
   },
   deleteProduct:(prodId)=>
   {
    return new Promise((resolve, reject) => {
         console.log(prodId)
         //console.log(ObjectId(prodId));
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new objectId(prodId)}).then((response)=>{
            console.log("response")
            resolve(response)
        })
    })
   },
   getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)}).then((product)=>{
            resolve(product)
        })
    })
   },
   updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(proId)},{$set:{
            Name:proDetails.Name,
            Description:proDetails.Description,
            Price:proDetails.Price,
            Category:proDetails.Category
        }
    }).then((response)=>{
        resolve()
    })
   })
}
}