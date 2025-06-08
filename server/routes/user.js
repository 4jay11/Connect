const userRouter = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Bookmark = require("../models/bookmarks");
const Stories = require("../models/Stories");
const userAuth = require("../middlewares/userAuth");
const mongoose = require("mongoose");
const upload = require("../middlewares/multer");
const cloudinary = require("../config/cloudinary");



// routes/userRoutes.js
userRouter.get("/search",userAuth ,  async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // First try userId match (startsWith, case-insensitive)
    let users = await User.find({
      userId: { $regex: `^${q}`, $options: "i" },
    }).select("_id userId username profilePicture");

    // If no userId match or less than 5, supplement with username
    if (users.length < 5) {
      const extraUsers = await User.find({
        username: { $regex: q, $options: "i" },
        _id: { $nin: users.map((u) => u._id) }, // avoid duplicates
      }).select("_id userId username profilePicture").limit(5 - users.length);
      users = [...users, ...extraUsers];
    }

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/bookmark", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;

    // Fetch bookmarks sorted by createdAt (most recent first)
    const bookmarks = await Bookmark.find({ userId: _id }).sort({
      createdAt: -1,
    });

    if (!bookmarks.length)
      return res.status(404).send("No Bookmarks Available");

    // Extract post IDs from bookmarks
    const postIds = bookmarks.map((bookmark) => bookmark.postId);

    // Fetch posts using the extracted post IDs
    const posts = await Post.find({ _id: { $in: postIds } });

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

userRouter.get("/:id", userAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user ID." });

    const userProfile = await User.findById(id);
    if (!userProfile)
      return res.status(404).json({ message: "User not found." });

    const userPosts = await Post.find({ userId: id }).populate(
      "likes",
      "username profilePicture"
    );

    const stories = await Stories.find({ userId: id }).populate(
      "userId",
      "username profilePicture"
    );

    res
      .status(200)
      .json({ user: userProfile, posts: userPosts, stories: stories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


userRouter.patch(
  "/update/:id",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID." });
      }

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found." });

      const updatedFields = {};

      if (req.body.bio) updatedFields.bio = req.body.bio;
      if (req.body.username) updatedFields.username = req.body.username;

      // Handle image upload if file exists
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        updatedFields.profilePicture = result.secure_url;
      } 

      // Only update if at least one field is provided
      if (Object.keys(updatedFields).length === 0) {
        return res
          .status(400)
          .json({ message: "No valid fields provided for update." });
      }

      const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
        new: true,
      });

      return res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);


module.exports = userRouter;
