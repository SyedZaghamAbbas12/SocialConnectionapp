const Notification = require("../models/Notification");

// 🔔 GET ALL NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification
      .find({ userId: req.user.id })
      .populate("senderId", "fullName avatar")
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ MARK AS READ
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true
    });

    res.json({ message: "Marked as read" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};