const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonorDonations,
  getAvailableDonations,
  getAcceptedDonations,
  acceptDonation,
  getUserCount

} = require('../controllers/donations');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All routes require authentication

// Donor routes
router.post('/', authorize('donor'), createDonation);
router.get('/donor', authorize('donor'), getDonorDonations);

// Receiver routes
router.post('/available', authorize('receiver'), getAvailableDonations);
router.get('/accepted', authorize('receiver'), getAcceptedDonations);
router.post('/:id/accept', authorize('receiver'), acceptDonation);

module.exports = router;
