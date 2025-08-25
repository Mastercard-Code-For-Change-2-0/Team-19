const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const ItemSchema = new Schema({
  photos: [{ type: String }],
  description: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String },
});

const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "receiver", "admin"], required: true },
});
const Account = model("Account", AccountSchema);

const HistorySchema = new Schema({
  username: { type: String, required: true, unique: true },
  items: { type: [ItemSchema], required: true },
});
const History = model("History", HistorySchema);

const ReceiverCurrentSchema = new Schema({
  username: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
});
const ReceiverCurrent = model("ReceiverCurrent", ReceiverCurrentSchema);

const DonatorCurrentSchema = new Schema({
  username: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
});
const DonatorCurrent = model("DonatorCurrent", DonatorCurrentSchema);

const AdminMatchSchema = new Schema({
  adminUsername: { type: String, required: true },
  donatorUsername: { type: String, required: true },
  receiverUsername: { type: String, required: true },

  itemMatched: { type: [ItemSchema], required: true },

  status: {
    type: String,
    enum: ["Proposed", "Confirmed", "InTransit", "Completed", "Cancelled"],
    default: "Proposed",
  },
  remarks: { type: String },
});
const AdminMatch = model("AdminMatch", AdminMatchSchema);

module.exports = {
  Account,
  History,
  ReceiverCurrent,
  DonatorCurrent,
  AdminMatch,
};
