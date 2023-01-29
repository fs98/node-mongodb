const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.EMAIL_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.redirect("/");
          } else {
            req.session.isLoggedIn = false;
            req.flash("error", "Invalid email or password");
            res.redirect("/login");
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage: req.flash("error"),
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      errorMessage: errors.array(),
    });
  }

  User.findOne({
    email: email,
  })
    .then((result) => {
      if (result) {
        req.flash("error", { msg: "This user already exists" });
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name: email,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then((result) => {
          res.redirect("/login");

          return transporter.sendMail({
            to: email,
            from: "sefer.fata@gmail.com",
            subject: "Signup Succeeded",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
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

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset-password",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");

    // Find user
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "User with this email does not exist.");
          return res.redirect("/reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // + one hour
        return user.save();
      })
      .then((result) => {
        transporter
          .sendMail({
            to: req.body.email,
            from: "sefer.fata@gmail.com",
            subject: "Password Reset",
            html: `
          <p>You requested a password change.</p>
          <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password..</p>
          `,
          })
          .then((result) => {
            req.flash(
              "error",
              "Email successfully sent. Please check your email inbox."
            );
            return res.redirect("/reset-password");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getChangePassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token invalid or expired. Please try again.");
        return res.redirect(`/reset-password`);
      }

      res.render("auth/set-password", {
        pageTitle: "Set New Password",
        path: "/reset-password",
        errorMessage: req.flash("error"),
        userId: user._id.toString(),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postChangePassword = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      return User.findByIdAndUpdate(req.body.userId, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiration: null,
      });
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
