const User = require("../models/User");   // ✅ ONLY ONCE
const mongoose = require("mongoose");    // ✅ also at top

// 🔥 FOLLOW / UNFOLLOW USER
exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? "Unfollowed" : "Followed"
    });

  } catch (err) {
    console.log("FOLLOW ERROR:", err);
    res.status(500).json({ message: "Follow error" });
  }
};

// ✅ SEARCH USERS
exports.searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const users = await User.find({
      fullName: { $regex: keyword, $options: "i" }
    }).select("_id fullName avatar");

    res.json(users);

  } catch (error) {
    console.log("SEARCH USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    res.json(user);
  } catch (error) {
    console.log("GET USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};