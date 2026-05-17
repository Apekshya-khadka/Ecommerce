// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: verify token
async function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ GET all orders for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching orders for user:", req.user._id);
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price stock"); // include product details
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// ✅ GET all orders (admin only)
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const orders = await Order.find()
      .populate("user", "name email") // show user details
      .populate("items.product", "name price stock"); // show product details

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin orders", error: err.message });
  }
});

// ✅ POST new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, grandTotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    console.log("Saving order for user:", req.user._id);

    const order = new Order({
      user: req.user._id,
      items,
      grandTotal,
      createdAt: Date.now()
    });

    await order.save();

    // ✅ Reduce stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
});

module.exports = router;
