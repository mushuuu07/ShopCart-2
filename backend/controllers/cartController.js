const Cart = require("../models/Cart");

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};