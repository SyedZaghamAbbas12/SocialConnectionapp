const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully", user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user: updatedUser });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPLOAD AVATAR
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatar = req.file.path; // or req.file.filename depending on multer setup
    await user.save();

    res.json({ message: "Avatar uploaded", avatar: user.avatar });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};