const express = require("express");
const authenticateJWT = require('../middlewares/authenticateJWT');
const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} = require("../controllers/wishlistController");
const router = express.Router();

router.post("/add", authenticateJWT, addToWishlist);
router.get("/:userId", authenticateJWT, getWishlist);
router.post("/remove", authenticateJWT, removeFromWishlist);

module.exports = router;
