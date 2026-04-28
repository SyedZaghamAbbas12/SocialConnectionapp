const express = require("express");
const router = express.Router();

const { getNotifications, markAsRead } = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// get notifications
router.get("/", auth, getNotifications);

// mark read
router.put("/:id", auth, markAsRead);

module.exports = router;