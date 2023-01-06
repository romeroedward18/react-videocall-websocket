const { PeerServer } = require("peer");
const peerServer = PeerServer({ port: 9000, path: "/myapp" });
const cors = require("./corsConfig");

const io = require("socket.io")(3001, {
  cors,
});

io.on("connection", (socket) => {
  console.log("connection: " + socket.id);

  socket.on("join-room", (room, userId) => {
    console.log("join-room");
    console.log(`room: ${room} userId: ${userId}`);
    socket.join(room);
    socket.broadcast.to(room).emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log(`disconnect: ${socket.id}`);
      socket.broadcast.to(room).emit("user-disconnected", userId);
    });
  });

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});
