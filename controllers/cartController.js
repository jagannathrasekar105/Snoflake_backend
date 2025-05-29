const cartModel = require("../models/cartModel");

// Add item to cart
exports.addToCart = async (req, res) => {
    const userId = req.user.id; // Get userId from decoded token
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        await cartModel.addToCart(userId, productId, quantity);
        res.status(201).json({
            message: "Item added to cart",
            userId,
            productId,
            quantity,
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Failed to add to cart", error: error.message });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const result = await cartModel.updateCartItem(userId, productId, quantity);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item updated successfully" });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get cart items for a user
exports.getCartItems = async (req, res) => {
    const userId = req.user.id;

    try {
        const items = await cartModel.getCartItems(userId);
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: "Failed to fetch cart items", error: error.message });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({ message: "Missing productId parameter" });
    }

    try {
        await cartModel.removeCartItem(userId, productId);
        res.status(200).json({ message: "Item removed from cart", userId, productId });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ message: "Failed to remove cart item", error: error.message });
    }
};
