const path = require("path");

const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// LOGIN
router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

module.exports = router;
