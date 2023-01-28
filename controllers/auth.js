const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = user ? true : false;
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.password;

  User.findOne({
    email: email,
  })
    .then((result) => {
      if (result) {
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12);
    })
    .then((password) => {
      const user = new User({
        name: email,
        email: email,
        password: password,
        cart: { items: [] },
      });

      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
};
