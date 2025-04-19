const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on('join-room', (userId) => {
    console.log(`User ${userId} joined room.`);
    socket.join(`user.${userId}`); // Join user-specific room
});

  socket.on("send-message", (data) => {
    console.log("Received message:", data);
    io.emit("receive-message", data);
  });

  socket.on("typing", (data) => {
    console.log(`Typing: ${data.sender_name}`);
    socket.broadcast.emit("typing", data);
  });

  socket.on("stop-typing", (data) => {
    console.log(`Stopped typing: ${data.sender_name}`);
    socket.broadcast.emit("stop-typing", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Socket.IO server running at http://192.168.1.104:3000");
});
