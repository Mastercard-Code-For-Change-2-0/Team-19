import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    someToken: { type: String },
    documentInfo: { type: String },
  },
  { _id: false }
);

const donateitems = new mongoose.Schema(
  {
    photos: [{ type: String }],
    description: { type: String },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const DonatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    passport: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    address: { type: String },
    inNeed: [donateitems],
    history: [HistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Donator", DonatorSchema);
