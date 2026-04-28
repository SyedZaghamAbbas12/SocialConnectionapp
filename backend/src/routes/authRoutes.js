const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  register,
  login,
  updateProfile,
  getProfile,
  uploadAvatar,
  getMe
} = require('../controllers/authController');

// AUTH
router.post('/signup', register);
router.post('/login', login);

// PROFILE
router.get('/profile', auth, getProfile);
router.get('/me', auth, getMe);
router.put('/update-profile', auth, updateProfile);

// AVATAR UPLOAD
router.post(
  '/upload-avatar',
  auth,
  upload.single('avatar'),
  uploadAvatar
);

module.exports = router;