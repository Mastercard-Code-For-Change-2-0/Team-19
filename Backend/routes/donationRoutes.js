const express = require("express");
const Donation = require("../models/Donation");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Donor creates donation
router.post("/post", auth(["donor"]), async (req, res) => {
  try {
    const donation = new Donation({ ...req.body, donorId: req.user.id });
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all donations
router.get("/", async (req, res) => {
  const donations = await Donation.find().populate("donorId", "name email");
  res.json(donations);
});

module.exports = router;
