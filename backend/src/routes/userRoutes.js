const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { 
  followUser, 
  getUserById,
  searchUsers   // ✅ ADD THIS
} = require("../controllers/userController");

// ✅ 1. SEARCH USERS (MUST BE FIRST)
router.get("/search", auth, searchUsers);

// ✅ 2. FOLLOW / UNFOLLOW
router.post("/:id/follow", auth, followUser);

// ✅ 3. GET USER PROFILE (KEEP LAST)
router.get("/:id", auth, getUserById);

module.exports = router;