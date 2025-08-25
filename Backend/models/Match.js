const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);
