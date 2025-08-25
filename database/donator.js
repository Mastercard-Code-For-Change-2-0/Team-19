const mongoose = require("mongoose");
const HistorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    Token: { type: String },
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
    donates: [donateitems],
    history: [HistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donator", DonatorSchema);
