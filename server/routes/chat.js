const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { Chat } = require("../models/chat");

const  chatRouter = express.Router();

chatRouter.get("/chat/members", userAuth, async (req, res) => {
  try {
    const myId = req.user._id;

    const chats = await Chat.find({ participants: myId }).populate(
      "participants",
      "username profilePicture bio followers following"
    );


    const otherUsersMap = new Map();

    chats.forEach((chat) => {
      chat.participants.forEach((user) => {
        if (user._id.toString() !== myId.toString()) {
          otherUsersMap.set(user._id.toString(), user);
        }
      });
    });

    res.json(Array.from(otherUsersMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

chatRouter.delete("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    if (!userId || !targetUserId) {
      return res.status(400).send("Provide the user id");
    }

    const result = await Chat.deleteOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (result.deletedCount === 0) {
      return res.status(404).send("No chat found to delete");
    }

    res.status(200).send("Successfully deleted");
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).send("Internal server error");
  }
});


chatRouter.delete("/deleteChats/:targetUserId", userAuth, async (req, res) => {
  try {
    const { messageIds  , deleteForEveryone = false } = req.body;
    const currentUserId = req.user._id;
    const targetUserId = req.params.targetUserId;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: "No message IDs provided." });
    }

    // Find the chat between users
    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    // Process each message
    chat.messages = chat.messages.filter((msg) => {
      const isTargetMessage = messageIds.includes(msg._id.toString());

      if (!isTargetMessage) return true;

      if (deleteForEveryone) {
        // Only allow sender to delete for everyone
        if (msg.senderId.toString() === currentUserId.toString()) {
          return false; // Remove from chat
        } else {
          return true; // Not sender, don't delete
        }
      } else {
        // Delete for me only
        if (!msg.deletedFor.includes(currentUserId)) {
          msg.deletedFor.push(currentUserId);
        }
        return true; // Keep message for others
      }
    });

    await chat.save();

    res.status(200).json({ message: "Message(s) deleted successfully." });
  } catch (err) {
    console.error("Error deleting messages:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});




chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "username",
    });

    // Create new chat if doesn't exist
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    // Filter out messages deleted for current user
    const filteredMessages = chat.messages.filter(
      (msg) => !msg.deletedFor.some((id) => id.toString() === userId.toString())
    );

    // Return filtered chat object (with rest of chat fields intact)
    res.json({
      ...chat.toObject(),
      messages: filteredMessages,
    });
  } catch (err) {
    console.error("Error getting chat:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = chatRouter;
