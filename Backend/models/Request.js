const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["Clothes", "Books", "Food", "Furniture", "Other"], required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ["pending", "approved", "matched", "fulfilled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
