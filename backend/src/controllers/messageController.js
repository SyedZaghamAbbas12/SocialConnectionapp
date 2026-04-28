const Message = require("../models/Message");
const Notification = require("../models/Notification");

// 📩 SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      text
    });

    // 🔔 create notification
    await Notification.create({
      userId: receiverId,
      senderId: req.user.id,
      type: "message",
      text: "sent you a message"
    });

    res.json(message);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 GET CHAT HISTORY
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};