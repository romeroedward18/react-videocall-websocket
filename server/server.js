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
  });

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});
