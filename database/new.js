const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ItemSchema = new Schema({
  photos: [{ type: String }],
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String, trim: true },
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
  role: {
    type: String,
    enum: ["user", "receiver", "admin"],
    required: true,
    default: "user",
  },
}, { timestamps: true });

const HistorySchema = new Schema({
  username: { type: String, required: true, unique: true },
  items: { type: [ItemSchema], required: true },
}, { timestamps: true });

const ReceiverCurrentSchema = new Schema({
  username: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
}, { timestamps: true });

const DonatorCurrentSchema = new Schema({
  username: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
}, { timestamps: true });

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
  remarks: { type: String, trim: true },
}, { timestamps: true });

module.exports = {
  Account: model("Account", AccountSchema),
  History: model("History", HistorySchema),
  ReceiverCurrent: model("ReceiverCurrent", ReceiverCurrentSchema),
  DonatorCurrent: model("DonatorCurrent", DonatorCurrentSchema),
  AdminMatch: model("AdminMatch", AdminMatchSchema),
};