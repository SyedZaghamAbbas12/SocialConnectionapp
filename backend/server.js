require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// routes
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();

// ✅ create HTTP server for socket
const server = http.createServer(app);

// ✅ socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// ================= SOCKET LOGIC =================

let onlineUsers = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🔥 user joins
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online Users:", onlineUsers);
  });

  // 🔥 send message (REALTIME)
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {

    const receiverSocketId = onlineUsers[receiverId];

    if (receiverSocketId) {
      // 📩 send message instantly
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        receiverId,
        text
      });

      // 🔔 send notification
      io.to(receiverSocketId).emit("newNotification", {
        type: "message",
        senderId,
        text: "sent you a message"
      });
    }
  });

  // ❌ disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // remove user from online list
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

// ================= MIDDLEWARE =================

app.use(express.json());
app.use(cors());

// serve uploads
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// ================= DATABASE =================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://192.168.100.18:${PORT}`);
});