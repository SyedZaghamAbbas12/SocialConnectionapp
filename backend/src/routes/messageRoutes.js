const express = require("express");
const router = express.Router();

const { sendMessage, getMessages } = require("../controllers/messageController");
const auth = require("../middleware/auth");

// send message
router.post("/", auth, sendMessage);

// get chat history
router.get("/chat/:userId", auth, getMessages);

module.exports = router;