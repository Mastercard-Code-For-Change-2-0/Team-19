const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["Pending", "Fulfilled", "Rejected"],
      default: "Pending",
      index: true,
    },
    contactInfo: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const NeedSchema = new mongoose.Schema(
  {
    photos: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    category: { type: String, trim: true, index: true },
    isFulfilled: { type: Boolean, default: false },
  },
  { _id: false }
);

const ReceiverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    passport: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    verified: { type: Boolean, default: false },
    address: { type: String, trim: true },
    needs: [NeedSchema],
    history: [HistorySchema],
    lastActive: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

ReceiverSchema.index({ email: 1, verified: 1 });

module.exports = mongoose.model("Receiver", ReceiverSchema);