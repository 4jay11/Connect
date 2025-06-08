const { Schema, model } = require("mongoose");

const StoriesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 50,
  },
  image: {
    type: String,
    required: true,
  },
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

module.exports = model("Stories", StoriesSchema);
