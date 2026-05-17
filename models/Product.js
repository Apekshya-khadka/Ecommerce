// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Product name
  price: { type: Number, required: true },         // Current price
  originalPrice: { type: Number },                 // ✅ Original price (for discounts)
  description: { type: String, required: true },   // Product description
  category: { type: String, required: true },      // Category (Shoes, Electronics, etc.)
  stock: { type: Number, required: true },         // Stock quantity
  image: { type: String }                          // ✅ Image URL
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

module.exports = mongoose.model("Product", productSchema);
