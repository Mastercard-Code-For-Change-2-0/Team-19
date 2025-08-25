const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["donor", "receiver", "admin"],
    required: true,
    index: true,
  },
}, { timestamps: true });

const Account = model("Account", AccountSchema);

const ItemSchema = new Schema({
  photos: [{ type: String, trim: true }],
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  category: {
    type: String,
    enum: ["books", "clothes", "electronics", "furniture", "toys", "other"],
    required: true,
    trim: true,
  },
  donor: {
    type: Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
  },
  donorUsername: { type: String, required: true, trim: true, index: true },
}, { timestamps: true });

ItemSchema.index({ donorUsername: 1, category: 1 });
const Item = model("Item", ItemSchema);

const HistorySchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, index: true },
  items: [{ type: Types.ObjectId, ref: "Item", required: true }],
}, { timestamps: true });
const History = model("History", HistorySchema);

const ReceiverCurrentSchema = new Schema({
  username: { type: String, required: true, trim: true, index: true },
  items: [{ type: Types.ObjectId, ref: "Item", required: true }],
}, { timestamps: true });
const ReceiverCurrent = model("ReceiverCurrent", ReceiverCurrentSchema);

const DonorCurrentSchema = new Schema({
  username: { type: String, required: true, trim: true, index: true },
  items: [{ type: Types.ObjectId, ref: "Item", required: true }],
}, { timestamps: true });
const DonorCurrent = model("DonorCurrent", DonorCurrentSchema);

const AdminMatchSchema = new Schema({
  adminUsername: { type: String, required: true, trim: true, index: true },
  donorUsername: { type: String, required: true, trim: true, index: true },
  receiverUsername: { type: String, required: true, trim: true, index: true },
  itemMatched: [{ type: Types.ObjectId, ref: "Item", required: true }],
  status: {
    type: String,
    enum: ["Proposed", "Confirmed", "InTransit", "Completed", "Cancelled"],
    default: "Proposed",
    trim: true,
    index: true,
  },
  remarks: { type: String, trim: true },
}, { timestamps: true });
const AdminMatch = model("AdminMatch", AdminMatchSchema);

module.exports = {
  Account,
  Item,
  History,
  ReceiverCurrent,
  DonorCurrent,
  AdminMatch,
};