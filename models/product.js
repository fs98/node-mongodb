const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, imageUrl, description, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.userId = userId;
//   }

//   static getAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static getById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({
//         _id: mongodb.ObjectId(id),
//       })
//       .toArray()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   store() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static updateById(id, title, price, imageUrl, description) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .updateOne(
//         { _id: mongodb.ObjectId(id) },
//         {
//           $set: {
//             title: title,
//             price: price,
//             imageUrl: imageUrl,
//             description: description,
//           },
//         }
//       )
//       .then((result) => {
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static destroy(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({
//         _id: mongodb.ObjectId(id),
//       })
//       .then((result) => {
//         return result;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
