const express = require("express");
const postRouter = express.Router();
const validator = require("validator");
const userAuth = require("../middlewares/userAuth");
const Post = require("../models/Post");
const Comment = require("../models/comments");
const Like = require("../models/likes");

postRouter.post("/addNewPost", userAuth, async (req, res) => {
  try {
    // Extract userId, content, and image from request body
    const { _id } = req.user; // user ID from authenticated user
    const { content, image, location } = req.body;

    // Validate content length (50 words max)
    if (!content || content.split(" ").length > 50) {
      return res
        .status(400)
        .json({ error: "Content must be within 50 words." });
    }

    // Ensure location is provided
    if (!location) {
      return res.status(400).json({ error: "Location is required." });
    }

    // Create a new Post instance
    const newPost = new Post({
      userId: _id,
      content,
      image: image || "",
      location,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Send success response
    res
      .status(201)
      .json({ message: "Post created successfully", post: savedPost });
  } catch (err) {
    res.status(500).json({ error: "Error: " + err.message });
  }
});

postRouter.delete("/deletePost/:post_id", userAuth, async (req, res) => {
  try {
    // Extract the currentUser id from req
    const { _id } = req.user;
    // Get the post id from params
    const postId = req.params.post_id;
    if (!postId) return res.status(401).json({ error: "Provide post id" });
    // Find post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    // Verify the post is belong to the currentUser then only allow to delete
    if (post.userId.toString() != _id)
      return res
        .status(401)
        .json({ error: "You can only delete your own posts" });
    // Delete the post in the post collection
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted Successfully" });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

postRouter.patch("/update/:post_id", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const { post_id } = req.params;
    const { caption } = req.body;

    if (!post_id) {
      return res.status(400).json({ error: "Post ID is required" });
    }
    if (!caption) {
      return res.status(400).json({ error: "Caption cannot be empty" });
    }

    // Find and update the caption
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post_id, userId: _id }, // Ensures only the owner can update
      { content: caption }, // Updating only the content (caption)
      { new: true } // Returns updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res
      .status(200)
      .json({ message: "Caption updated successfully", post: updatedPost });
  } catch (err) {
    res.status(500).json({ error: "Error: " + err.message });
  }
});


postRouter.get("/comments/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).populate("userId" , "username profilePicture");
    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: err.message });
  }
});

postRouter.get("/post-generator", userAuth, async (req, res) => {
  try {
    const { _id, following } = req.user;

    const posts = await Post.find({
      userId: { $in: following, $ne: _id },
    })
      .populate("userId", "username profilePicture") // Populate post owner
      .populate("likes", "username profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username profilePicture",
        },
      });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error: " + err.message });
  }
});

postRouter.get("/", userAuth, async (req, res) => {
  try {
    const { _id, following } = req.user;

    // Convert query params to numbers
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Ensure `following` is an array before spreading
    const followingList = Array.isArray(following) ? following : [];

    // Get posts from the current user and followed users
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({ posts, page, limit });
  } catch (err) {
    res.status(400).json({ error: "Error: " + err.message });
  }
});

module.exports = postRouter;
