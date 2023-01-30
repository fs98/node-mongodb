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
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
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
