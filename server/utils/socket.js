const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ username, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(username + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ username, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          const timestamp = new Date().toISOString();

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          const newMessage = {
            senderId: userId,
            text,
            createdAt: timestamp,
          };

          chat.messages.push(newMessage);
          await chat.save();

          const lastMessage = chat.messages[chat.messages.length - 1];

          io.to(roomId).emit("messageReceived", {
            _id: lastMessage._id,
            username,
            text,
            timestamp,
          });
        } catch (err) {
          console.log("Send Message Error:", err);
        }
      }
    );

    socket.on("typing", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
