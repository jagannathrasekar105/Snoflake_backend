const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const {
    addToCart,
    getCartItems,
    removeCartItem,
    updateCartItem,
} = require("../controllers/cartController");

// POST /api/cart - Add item to cart
router.post("/", authenticateJWT, addToCart);

// PUT /api/cart - Update cart item quantity
router.put("/", authenticateJWT, updateCartItem);

// GET /api/cart/:userId - Get all cart items for a user
router.get("/:userId", authenticateJWT, getCartItems);

// DELETE /api/cart/:userId/:productId - Remove item from cart
router.delete("/:userId/:productId", authenticateJWT, removeCartItem);

module.exports = router;
