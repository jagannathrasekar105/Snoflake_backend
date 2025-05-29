const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateJWT = require('../middlewares/authenticateJWT');
// POST - Place an order
router.post("/orders", authenticateJWT, orderController.saveOrder);

// GET - Get all orders by a specific user
router.get("/orders/:userId", authenticateJWT, orderController.getOrdersByUser);

module.exports = router;
