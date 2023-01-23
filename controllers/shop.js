const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate("cart.items.productId")
    .then(({ cart: { items } }) => {
      console.log(items);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  req.session.user
    .addToCart(prodId)
    .then((result) => {
      console.log("RESULT", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.session.user
    .removeFromCart(prodId)
    .then(() => {
      console.log("PRODUCT DELETED");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate("cart.items.productId")
    .then(({ cart: { items } }) => {
      console.log("ITEMS", items);
      const order = new Order({
        user: {
          userId: req.session.user._id,
          name: req.session.user.name,
          email: req.session.user.email,
        },
        products: items.map((item) => ({
          productId: item.productId._id,
          title: item.productId.title,
          price: item.productId.price,
          quantity: item.quantity,
        })),
      });

      return order.save();
    })
    .then(() => {
      req.session.user.cart = { items: [] };
      return req.session.user.save();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
