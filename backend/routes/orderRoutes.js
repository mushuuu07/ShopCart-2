const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrders
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getUserOrders);
router.get("/", authMiddleware, getAllOrders);

module.exports = router;