const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// LOGIN
router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/reset-password", authController.getReset);

router.post("/reset-password", authController.postReset);

router.get("/reset-password/:token", authController.getChangePassword);

router.post("/update-password", authController.postChangePassword);

module.exports = router;
