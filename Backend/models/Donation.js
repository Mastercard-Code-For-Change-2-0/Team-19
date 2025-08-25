const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["Clothes", "Books", "Food", "Furniture", "Other"], required: true },
  quantity: { type: Number, default: 1 },
  photos: [String],  
  status: { type: String, enum: ["pending", "approved", "matched", "completed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);
