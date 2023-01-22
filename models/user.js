const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  let updatedCart = {
    items: [...this.cart.items],
  };

  const productIndex = this.cart.items.findIndex(
    (cartProduct) => cartProduct.productId.toString() === productId.toString()
  );

  if (productIndex !== -1) {
    updatedCart.items[productIndex].quantity += 1;
  } else {
    updatedCart.items.push({
      productId: productId,
      quantity: 1,
    });
  }

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCart = this.cart.items.filter(
    (cartItem) => cartItem.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   static getById(id) {
//     const db = getDb();
//     console.log(id);
//     return db
//       .collection("users")
//       .findOne({
//         _id: mongodb.ObjectId(id),
//       })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   store() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // Cart Methods

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((product) => product.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (cartItem) =>
//                 cartItem.productId.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     let updatedCart = {
//       items: [...this.cart.items],
//     };

//     const productIndex = this.cart.items.findIndex(
//       (cartProduct) =>
//         cartProduct.productId.toString() === product._id.toString()
//     );

//     if (productIndex !== -1) {
//       updatedCart.items[productIndex].quantity += 1;
//     } else {
//       updatedCart.items.push({
//         productId: mongodb.ObjectId(product._id),
//         quantity: 1,
//       });
//     }

//     const db = getDb();

//     return db.collection("users").updateOne(
//       { _id: mongodb.ObjectId(this._id) },
//       {
//         $set: {
//           cart: updatedCart,
//         },
//       }
//     );
//   }

//   deleteCartProduct(productId) {
//     const db = getDb();

//     const updatedCart = this.cart.items.filter(
//       (cartItem) => cartItem.productId.toString() !== productId.toString()
//     );

//     return db.collection("users").updateOne(
//       { _id: mongodb.ObjectId(this._id) },
//       {
//         $set: {
//           cart: {
//             items: updatedCart,
//           },
//         },
//       }
//     );
//   }

//   // Order methods

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection("orders")
//       .find({ "user._id": mongodb.ObjectId(this._id) })
//       .toArray();
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: mongodb.ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };

//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }
// module.exports = User;
