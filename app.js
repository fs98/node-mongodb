const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");

const MONGODB_URI =
  "mongodb+srv://fsefer:LiPopatUrvG1mKJ0@cluster0.tofog5q.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("CONNECTED TO DATABASE");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
