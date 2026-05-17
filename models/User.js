// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // ✅ unique username
  email:    { type: String, required: true, unique: true }, // ✅ unique email
  password: { type: String, required: true },               // ✅ hashed password stored
  role:     { type: String, enum: ["user", "admin"], default: "user" } // ✅ role field
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model("User", userSchema);
