exports.getLogin = (req, res, next) => {
  console.log(req.body);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  res.redirect("/login");
};
