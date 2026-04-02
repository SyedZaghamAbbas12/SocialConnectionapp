const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');       // auth middleware
const upload = require('../middleware/upload');   // multer upload

// Import all controller functions
const { register, login, updateProfile, getProfile, uploadAvatar } = require('../controllers/authController');

// Auth routes
router.post('/signup', register);                          // Sign up
router.post('/login', login);                              // Login
router.get('/profile', auth, getProfile);                 // Get logged-in user's profile
router.put('/update-profile', auth, updateProfile);       // Update profile
router.post('/upload-avatar', auth, upload.single('avatar'), uploadAvatar); // Upload avatar

module.exports = router;