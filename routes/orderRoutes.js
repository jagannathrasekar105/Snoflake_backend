const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// POST - Place an order
router.post("/orders", orderController.saveOrder);

// GET - Get all orders by a specific user
router.get("/orders/:userId", orderController.getOrdersByUser);

module.exports = router;
