const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  foodType: {
    type: String,
    required: [true, 'Please specify the type of food']
  },
  quantity: {
    type: String,
    required: [true, 'Please specify the quantity']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please specify the expiry date']
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please specify the pickup location']
  },
  latitude: {
    type: String,
    required: [true, 'Failed To Fetch']
  },
longitude: {
    type: String,
    required: [true, 'Failed To Fetch']
  },
  additionalNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'expired'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent donor from creating multiple active donations
donationSchema.index({ donor: 1, status: 1 });

// Automatically expire donations past their expiry date
donationSchema.pre('save', function(next) {
  if (this.expiryDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
