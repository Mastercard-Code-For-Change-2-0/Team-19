const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, organizationType, latitude,longitude} = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phone || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate role-specific fields
    if (role === 'donor' && !organizationType) {
      return res.status(400).json({
        success: false,
        message: 'Organization type is required for donors'
      });
    }


    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
      organizationType,
      longitude,
      latitude
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      latitude : user.latitude,
      longitude : user.longitude,
    }
  });
};

exports.getUserCount = async (req, res) => {
  try {
    const donors = await User.countDocuments({ role: 'donor' });
    const receivers = await User.countDocuments({ role: 'receiver' });

    res.status(200).json({
      success: true,
      data: { donors, receivers }
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getDonorRoleCount = async (req, res) => {
  try {
    const organizationTypes
    = ['restaurant', 'grocery', 'hotel', 'catering', 'other'];

    const counts = await Promise.all(
      organizationTypes
.map(async (type) => {
        const count = await User.countDocuments({ role: 'donor', organizationType
          : type });
        return { type, count };
      })
    );

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error('Error fetching donor role count:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};


exports.getReciverRoleCount = async (req, res) => {
  try {
    const organizationTypes
    = ['ngo', 'shelter', 'foodbank', 'charity', 'other'];
 

    const counts = await Promise.all(
      organizationTypes
.map(async (type) => {
        const count = await User.countDocuments({ role: 'receiver', organizationType
          : type });
        return { type, count };
      })
    );

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error('Error fetching donor role count:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
exports.getDonationCount = async (req, res) => {
  try {
    
 

const counts = await Donation.countDocuments() ;

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error('Error fetching donor role count:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};