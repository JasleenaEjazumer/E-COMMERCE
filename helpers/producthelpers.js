var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require("mongodb").ObjectId;
module.exports =
{

    addProduct: (products, callback) => {

        db.get().collection('product').insertOne(products).then((data) => {

            callback(data.insertedId)
        })
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
   }
}