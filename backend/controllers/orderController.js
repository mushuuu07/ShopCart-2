const Order = require("../models/Order");
const Cart = require("../models/Cart");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user.id,
      orderItems: cart.items,
      totalPrice
    });

    // clear cart after order
    cart.items = [];
    await cart.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};