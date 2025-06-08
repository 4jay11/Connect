const express = require("express");
const mongoose = require("mongoose");
const postReactionRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const Post = require("../models/Post");
const Comment = require("../models/comments");
const Bookmark = require("../models/bookmarks");
// Like or Unlike a post
postReactionRouter.post("/like/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    let updatedPost;

    if (post.likes.includes(userId)) {
      // `$pull` -> Removes a specific value from an array
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      return res.json({
        message: "Post unliked.",
        data: updatedPost,
        likesCount: updatedPost.likes.length,
      });
    }

    // `$addToSet` -> Adds a value only if it doesn’t already exist
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    res.json({
      message: "Post liked.",
      data: updatedPost,
      likesCount: updatedPost.likes.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Add a Comment
postReactionRouter.post("/comment/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    // Validate input
    if (!text)
      return res.status(400).json({ message: "Comment cannot be empty." });
    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ message: "Invalid post ID." });

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Create and save the comment
    const newComment = new Comment({ postId, userId, text });
    await newComment.save();
    newComment.populate("userId", "username profilePicture");

    // Add the comment ID to the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res
      .status(201)
      .json({ message: "Comment added.", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Delete a Comment
postReactionRouter.delete("/comment/:commentId", userAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId))
      return res.status(400).json({ message: "Invalid comment ID." });

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found." });

    // Ensure the user is the author of the comment
    if (comment.userId.toString() !== userId.toString())
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment." });

    // Remove comment from Comment collection
    await Comment.findByIdAndDelete(commentId);

    // Remove the comment reference from the Post's comments array
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: commentId },
    });

    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Toggle Bookmark (Add/Remove)
postReactionRouter.post("/bookmark/:postId", userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Check if the post is already bookmarked
    const existingBookmark = await Bookmark.findOne({ userId, postId });

    if (existingBookmark) {
      // Remove bookmark if it exists
      await Bookmark.findOneAndDelete({ userId, postId });
      await Post.findByIdAndUpdate(postId, {
        $pull: { bookmarks: userId },
      });
      res.status(200).json({ message: "Bookmark removed successfully." });
    } else {
      // Add new bookmark
      const newBookmark = new Bookmark({ userId, postId });
      await newBookmark.save();
      await Post.findByIdAndUpdate(postId, {
        $push: { bookmarks: newBookmark.userId },
      });
      res
        .status(201)
        .json({ message: "Post bookmarked.", bookmarkId: newBookmark._id });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong." });
  }
});




module.exports = postReactionRouter;
