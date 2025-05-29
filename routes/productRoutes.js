const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateJWT = require('../middlewares/authenticateJWT');

// ✅ Import the controller
const {
    getProductCategoriesAndAllProducts,
    getProductDetailsById, // Import the new function
    getTopSellingProducts
} = require("../controllers/productController");

// Get top selling products


// ✅ Use the imported controller here
router.get("/products-with-categories", authenticateJWT, getProductCategoriesAndAllProducts);

// ✅ New route to get product details by ID
router.get("/top-selling", authenticateJWT, getTopSellingProducts);

// Route to get product details by ID
router.get("/:id", authenticateJWT, getProductDetailsById);

module.exports = router;
