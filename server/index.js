const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`);
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log("Server Started 🛜");
});
