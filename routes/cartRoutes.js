const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCartItems,
    removeCartItem,
    updateCartItem,
} = require("../controllers/cartController");

// POST /api/cart - Add item to cart
router.post("/", addToCart);

// PUT /api/cart - Update cart item quantity
router.put("/", updateCartItem);

// GET /api/cart/:userId - Get all cart items for a user
router.get("/:userId", getCartItems);

// DELETE /api/cart/:userId/:productId - Remove item from cart
router.delete("/:userId/:productId", removeCartItem);

module.exports = router;
