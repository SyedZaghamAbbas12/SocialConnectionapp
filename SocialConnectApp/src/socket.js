// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://192.168.100.18:5000", {
  transports: ["websocket"],
  forceNew: true,
});

export default socket;