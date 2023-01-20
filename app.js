const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findOne()
    .then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Fata",
          email: "sefer.fata@gmail.com",
          cart: {
            items: [],
          },
        });
        newUser
          .save()
          .then(() => {
            req.user = newUser;
            next();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        req.user = new User({
          name: user.name,
          email: user.email,
          cart: user.cart,
        });
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://fsefer:LiPopatUrvG1mKJ0@cluster0.tofog5q.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("CONNECTED TO DATABASE");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
