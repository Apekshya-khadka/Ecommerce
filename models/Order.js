// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 // ✅ ensure at least 1 item
      },
      total: { 
        type: Number, 
        required: true, 
        min: 0 // ✅ prevent negative totals
      }
    }
  ],
  grandTotal: { 
    type: Number, 
    required: true, 
    min: 0 // ✅ prevent negative totals
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true }); // ✅ adds updatedAt automatically

module.exports = mongoose.model("Order", orderSchema);
