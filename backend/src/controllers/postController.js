const Post = require("../models/Post");

// ==========================
// ✅ CREATE POST
// ==========================
exports.createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const newPost = new Post({
      description: req.body.description,
      image: req.file.filename,
      userId: req.user.id
    });

    await newPost.save();

    res.status(201).json(newPost);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= ADD COMMENT =================
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      userId: req.user.id,
      text
    };

    post.comments.push(comment);
    await post.save();

    res.json({
      message: "Comment added",
      comments: post.comments
    });

  } catch (err) {
    console.log("COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ==========================
// ✅ GET POSTS
// ==========================
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "fullName avatar")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};


// ==========================
// 🗑 DELETE POST
// ==========================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // optional ownership check
    if (post.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete error" });
  }
};


// ==========================
// ❤️ LIKE / UNLIKE POST
// ==========================
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);

  } catch (err) {
    console.log("LIKE ERROR:", err);
    res.status(500).json({ message: "Like error" });
  }
};