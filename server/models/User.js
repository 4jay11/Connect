const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userId : {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://img1.pnghut.com/21/23/15/vVJVENtiMw/logo-user-profile-emoticon-hamburger-button-avatar.jpg",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    allowMessagesFrom: {
      type: String,
      enum: ["everyone", "followers"],
      default: "everyone",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
