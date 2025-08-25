const express = require("express");
const Request = require("../models/Request");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Receiver creates request
router.post("/post", auth(["receiver"]), async (req, res) => {
  try {
    const request = new Request({ ...req.body, receiverId: req.user.id });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all requests
router.get("/", async (req, res) => {
  const requests = await Request.find().populate("receiverId", "name email");
  res.json(requests);
});

module.exports = router;
