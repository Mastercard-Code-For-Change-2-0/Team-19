const express = require("express");
const Donation = require("../models/Donation");
const Request = require("../models/Request");
const Match = require("../models/Match");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Approve donation
router.put("/approve-donation/:id", auth(["admin"]), async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json(donation);
});

// Approve request
router.put("/approve-request/:id", auth(["admin"]), async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  res.json(request);
});

// Match donation ↔ request
router.post("/match", auth(["admin"]), async (req, res) => {
  const { donationId, requestId } = req.body;
  const match = new Match({ donationId, requestId, adminId: req.user.id, status: "approved" });
  await match.save();

  await Donation.findByIdAndUpdate(donationId, { status: "matched" });
  await Request.findByIdAndUpdate(requestId, { status: "matched" });

  res.json(match);
});

module.exports = router;
