const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  avatar: String,
  bio: String,
  followers: [
  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
],
following: [
  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
]
});


module.exports = mongoose.model("User", userSchema);