const fs = require("fs");
const https = require("https");
const express = require("express");
const { PeerServer } = require("peer");
const socketIo = require("socket.io");

const app = express();

// 🔹 Load SSL certificate & key
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// 🔹 Create HTTPS server
const server = https.createServer(options, app);
const io = socketIo(server);

// Serve static files (frontend)
app.use(express.static("public"));

// 🔹 Start PeerJS server on HTTPS
const peerServer = PeerServer({ port: 9000, path: "/", ssl: options });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔹 Start the HTTPS server
server.listen(5000, () => {
  console.log("🚀 HTTPS server running at https://<your-local-ip>:5000");
});
