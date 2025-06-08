const mongoose = require("mongoose");
const User = require("./User"); // Import User model

const ConnectionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save Middleware: Prevent duplicates, self-requests & update followers/following**
ConnectionSchema.pre("save", async function (next) {
  try {
    if (this.senderId.equals(this.receiverId)) {
      return next(
        new Error("Users cannot send friend requests to yourself.")
      );
    }


    // Check receiver's profile visibility
    const receiver = await User.findById(this.receiverId);
    if (receiver && receiver.profileVisibility === "public") {
      this.status = "accepted"; // Auto-accept request
    }

    // If request is accepted, update followers & following before saving
    if (this.status === "accepted") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await User.findByIdAndUpdate(
          this.receiverId,
          { $addToSet: { followers: this.senderId } },
          { session }
        );

        await User.findByIdAndUpdate(
          this.senderId,
          { $addToSet: { following: this.receiverId } },
          { session }
        );

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Post-remove Middleware: Remove from followers & following if request is deleted
ConnectionSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (doc && doc.status === "accepted") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await User.findByIdAndUpdate(
          doc.receiverId,
          { $pull: { followers: doc.senderId } },
          { session }
        );

        await User.findByIdAndUpdate(
          doc.senderId,
          { $pull: { following: doc.receiverId } },
          { session }
        );

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error removing followers/following:", error);
      }
    }
  } catch (error) {
    console.error("Error in post-remove middleware:", error);
  }
});

module.exports = mongoose.model("Connection", ConnectionSchema);
