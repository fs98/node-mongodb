const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const mongoConnect = require("./util/database").mongoConnect;
const shopRoutes = require("./routes/shop");
const User = require("./models/user");
const { getDb } = require("./util/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const db = getDb();
  db.collection("users")
    .findOne()
    .then((user) => {
      if (!user) {
        const newUser = new User("Fata", "sefer.fata@gmail.com", null);
        newUser
          .store()
          .then((result) => {
            req.user = newUser;
            next();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
  app.listen(3000);
});
