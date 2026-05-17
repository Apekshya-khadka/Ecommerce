// middleware/validateProduct.js
const { body } = require("express-validator");

exports.validateProduct = [
  body("name")
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 2 }).withMessage("Product name must be at least 2 characters"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("category")
    .notEmpty().withMessage("Category is required"),

  body("stock")
    .notEmpty().withMessage("Stock is required")
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("image")
    .optional()
    .isURL().withMessage("Image must be a valid URL")
];
