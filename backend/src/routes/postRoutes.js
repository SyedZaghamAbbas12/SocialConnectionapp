const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const {
  createPost,
  getPosts,
  likePost,
  deletePost,
  addComment
} = require("../controllers/postController");



router.post("/:id/comment", auth, addComment);
// ✅ DELETE POST
router.delete("/:id", auth, deletePost);

// ✅ CREATE POST
router.post("/", auth, upload.single("image"), createPost);

// ✅ GET POSTS
router.get("/", getPosts);

// ✅ LIKE / UNLIKE
router.post("/:id/like", auth, likePost);

module.exports = router;