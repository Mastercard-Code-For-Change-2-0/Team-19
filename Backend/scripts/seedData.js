const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donation = require('../models/Donation');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createTestData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Donation.deleteMany();

    // Create test users
    const donorPassword = await bcrypt.hash('password123', 10);
    const receiverPassword = await bcrypt.hash('password123', 10);

    const donor = await User.create({
      name: 'Test Restaurant',
      email: 'donor@test.com',
      password: donorPassword,
      role: 'donor',
      phone: '1234567890',
      address: '123 Restaurant St, City',
      organizationType: 'Restaurant'
    });

    const receiver = await User.create({
      name: 'Test NGO',
      email: 'receiver@test.com',
      password: receiverPassword,
      role: 'receiver',
      phone: '0987654321',
      address: '456 NGO Ave, City',
      ngoRegistrationNumber: 'NGO123456'
    });

    // Create test donations
    await Donation.create({
      donor: donor._id,
      foodType: 'Mixed Vegetables',
      quantity: '5 kg',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      pickupLocation: '123 Restaurant St, City',
      additionalNotes: 'Fresh vegetables from today\'s stock',
      status: 'pending'
    });

    await Donation.create({
      donor: donor._id,
      foodType: 'Cooked Meals',
      quantity: '20 meals',
      expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      pickupLocation: '123 Restaurant St, City',
      additionalNotes: 'Packed meals ready for distribution',
      status: 'pending'
    });

    console.log('Test data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating test data:', err);
    process.exit(1);
  }
};

// Run the script
connectDB().then(() => createTestData());
