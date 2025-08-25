const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { getUserCount } = require('../controllers/auth');
const { getDonorRoleCount,getReciverRoleCount,getDonationCount } = require('../controllers/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/user-count',getUserCount );
router.get('/donor-role-count', getDonorRoleCount);
router.get('/reciver-role-count', getReciverRoleCount);
router.get('/donation-count', getDonationCount);

module.exports = router;
