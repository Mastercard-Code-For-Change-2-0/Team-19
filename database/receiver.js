import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Fulfilled", "Rejected"],
      default: "Pending",
    },

    contactInfo: { type: String },
  },
  { _id: false }
);

const NeedSchema = new mongoose.Schema(
  {
    photos: [{ type: String }],
    description: { type: String },
    quantity: { type: Number, required: true },
    category: { type: String },
  },
  { _id: false }
);

const ReceiverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    passport: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    address: { type: String },
    needs: [NeedSchema],
    history: [HistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Receiver", ReceiverSchema);
