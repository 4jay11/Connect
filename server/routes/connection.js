const express = require("express");
const connectionRouter = express.Router();
const Connection = require("../models/ConnectionSchema");
const userAuth = require("../middlewares/userAuth");

connectionRouter.get("/all-requests/", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;

    // Find connection requests with "pending" status and populate sender details
    const connectionRequests = await Connection.find({
      receiverId: _id,
      status: "pending",
    })
      .populate("senderId", "_id username profilePicture followers following") // Populate only required fields
      .exec();

    if (!connectionRequests.length) {
      return res
        .status(404)
        .json({ error: "No pending connection requests found." });
    }

    res.status(200).json(connectionRequests);
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Create new conneciton request
connectionRouter.post("/request/:receiverId", userAuth, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required." });
    }
    if (senderId.toString() === receiverId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot send a request to yourself." });
    }

    // Check if a connection already exists in either direction
    const existingConnection = await Connection.findOne({
      senderId,
      receiverId,
    });

    if (existingConnection) {
      if (existingConnection.status === "pending") {
        return res
          .status(400)
          .json({ error: "A connection request is already pending." });
      }
      if (existingConnection.status === "accepted") {
        return res.status(400).json({ error: "You are already connected." });
      }
    }

    // Create a new connection request
    const connection = new Connection({
      senderId,
      receiverId,
      status: "pending",
    });

    await connection.save();

    return res
      .status(201)
      .json({ message: "Connection request sent.", connection });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: error.message });
  }
});


// Delete a Connection Request or Existing Connection
connectionRouter.delete("/:connectionId", userAuth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found." });
    }

    if (
      connection.senderId.toString() !== req.user.id &&
      connection.receiverId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized action." });
    }

    await Connection.findOneAndDelete({ _id: connectionId });

    return res
      .status(200)
      .json({ message: "Connection deleted successfully." });
  } catch (error) {
    console.error("Error deleting connection:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Accept a Connection Request
connectionRouter.patch(
  "/request/accept/:connectionId",
  userAuth,
  async (req, res) => {
    try {
      const { connectionId } = req.params;

      const connection = await Connection.findById(connectionId);
      if (!connection) {
        return res.status(404).json({ error: "Connection request not found." });
      }

      if (connection.receiverId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Only the receiver can accept the request." });
      }

      connection.status = "accepted";
      await connection.save();

      return res
        .status(200)
        .json({ message: "Connection accepted.", connection });
    } catch (err) {
      console.error("Error accepting connection:", err);
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
);

module.exports = connectionRouter;
