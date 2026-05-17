const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order"); 
const { authMiddleware } = require("./middleware/authMiddleware");

// Add to cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cartItem = new Cart({
      user: req.user._id,
      product: productId,
      quantity: quantity || 1
    });

    await cartItem.save();
    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
});

// Get cart items for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate("product");
    res.json(cartItems);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
});

// Remove item from cart
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
});

// ✅ Checkout route: create order, clear cart, reduce stock
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email");
    const cartItems = await Cart.find({ user: req.user._id }).populate("product");

    if (!cartItems || cartItems.length === 0) {
      return res.json({ message: "Cart is empty" });
    }

    const items = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    }));

    const grandTotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // ✅ Save order
    const order = new Order({
      user: req.user._id,
      items,
      grandTotal,
      createdAt: Date.now()
    });
    await order.save();

    // ✅ Reduce stock for each product
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }, // decrease stock
        { new: true }
      );
    }

    // ✅ Clear cart after checkout
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error during checkout:", err);
    res.status(500).json({ message: "Error during checkout", error: err.message });
  }
});

module.exports = router;
