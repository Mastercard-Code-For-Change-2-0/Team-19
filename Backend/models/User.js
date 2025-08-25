const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed
  role: { type: String, enum: ["donor", "receiver", "admin"], required: true },
  phone: String,
  organization: String,   // for NGOs / companies
  language: { type: String, default: "en" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
