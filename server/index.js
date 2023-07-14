// Your existing code
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let waitingRoom = null;  // The new waiting room variable

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_request", () => {
    if (waitingRoom) {
      socket.join(waitingRoom);
      console.log(`User with ID: ${socket.id} joined room: ${waitingRoom}`);
      socket.to(waitingRoom).emit('room_joined', waitingRoom);
      socket.emit('room_joined', waitingRoom);
      waitingRoom = null;
    } else {
      const roomID = Math.random().toString(36).substring(2, 15);
      socket.join(roomID);
      console.log(`User with ID: ${socket.id} created room: ${roomID}`);
      waitingRoom = roomID;
    }
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
