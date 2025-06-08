const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    stories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stories",
      },
    ],
  },
  { timestamps: true }
);

// Ensure a user can't create multiple highlights with the same name
highlightSchema.index({ userId: 1, name: 1 }, { unique: true });


module.exports = mongoose.model("Highlight", highlightSchema);
