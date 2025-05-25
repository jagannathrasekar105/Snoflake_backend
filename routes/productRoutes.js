const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Import the controller
const {
    getProductCategoriesAndAllProducts,
    getProductDetailsById, // Import the new function
    getTopSellingProducts
} = require("../controllers/productController");

// Get top selling products


// ✅ Use the imported controller here
router.get("/products-with-categories", getProductCategoriesAndAllProducts);

// ✅ New route to get product details by ID
router.get("/top-selling", getTopSellingProducts);

// Route to get product details by ID
router.get("/:id", getProductDetailsById);

module.exports = router;
