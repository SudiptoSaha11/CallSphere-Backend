// server.js
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

require("dotenv").config();
const path = require("path");

// Room logic
const MAX_USERS_PER_ROOM = 10;
const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  console.log(`Socket.io: User connected [id=${socket.id}]`);

  socket.on("join room", (roomID) => {
    users[roomID] = users[roomID] || [];
    if (users[roomID].length >= MAX_USERS_PER_ROOM) {
      socket.emit("room full");
      return;
    }
    users[roomID].push(socket.id);
    socketToRoom[socket.id] = roomID;

    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    if (roomID && users[roomID]) {
      users[roomID] = users[roomID].filter((id) => id !== socket.id);
      if (users[roomID].length === 0) {
        delete users[roomID];
      }
    }
    socket.broadcast.emit("user left", socket.id);
    delete socketToRoom[socket.id];
    console.log(`Socket.io: User disconnected [id=${socket.id}]`);
  });

  socket.on("change", (payload) => {
    socket.broadcast.emit("change", payload);
  });
});

// ---------- Static serving for production only ----------
const PORT = process.env.PORT;

// ---------- Start server ----------
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
