const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuthenticated, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuthenticated, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuthenticated,
  [
    body("title", "Please enter a title").isLength({ min: 1 }).trim(),
    // body("image", "Please enter image url").isLength({ min: 1 }).trim(),
    body("price", "Please enter a valid price")
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Price must not be less than 1")
      .trim(),
    body("description", "Please enter a description")
      .isLength({ min: 1 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  isAuthenticated,
  [
    body("title", "Please enter a title").isLength({ min: 1 }).trim(),
    // body("image", "Please enter image url").isLength({ min: 1 }).trim(),
    body("price", "Please enter a valid price")
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Price must not be less than 1")
      .trim(),
    body("description", "Please enter a description")
      .isLength({ min: 1 })
      .trim(),
  ],
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  isAuthenticated,
  adminController.postDeleteProduct
);

module.exports = router;
