const Stories = require("../models/Stories");
const express = require("express");
const storyRouter = express.Router();
const validator = require("validator");
const userAuth = require("../middlewares/userAuth");

storyRouter.post("/addNewStory", userAuth, async (req, res) => {
  try {
    // Extract userId, content, and image from request body
    const { _id } = req.user; // user ID from authenticated user
    const { content, image } = req.body;
    // Validate content length (50 words max)
    if (!content || content.split(" ").length > 50) {
      return res
        .status(400)
        .json({ error: "Content must be within 50 words." });
    }
    // Validate image format using validator
    if (image && !validator.isURL(image)) {
      return res.status(400).json({ error: "Invalid image URL." });
    }
    // Create a new Post instance
    const newStory = new Stories({
      userId: _id,
      content,
      image,
    });
    console.log(Stories);
    // Save the new story to the database
    await newStory.save();
    res.status(200).json({ message: "Story added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
storyRouter.get("/getStoryById/:storyId", userAuth, async (req, res) => {
  try {
    const { storyId } = req.params;

    // Validate storyId
    if (!validator.isMongoId(storyId)) {
      return res.status(400).json({ error: "Invalid storyId" });
    }

    const story = await Stories.findById(storyId)
      .populate("userId", "username profileImage")

    
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ story });
  } catch (err) {
    console.error("Error fetching story:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

storyRouter.delete("/deleteStory/:story_id", userAuth, async (req, res) => {
  try {
    // Extract the currentUser id from req
    const { _id } = req.user;
    // Get the post id from params
    const storyId = req.params.story_id;
    if (!storyId) return res.status(401).json({ error: "Provide story id" });
    // Find post
    const story = await Stories.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });
    // Verify the post is belong to the currentUser then only allow to delete
    if (story.userId.toString() != _id)
      return res
        .status(401)
        .json({ error: "You can only delete your own stories" });
    // Delete the post in the post collection
    await Stories.findByIdAndDelete(storyId);
    res.status(200).json({ message: "Story deleted Successfully" });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

storyRouter.patch("/view/:storyId", userAuth, async (req, res) => {
  try {
    const { storyId } = req.params;
    const { _id } = req.user;
    const story = await Stories.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });
    // if (story.userId.toString() === _id) {
    //   return res.status(401).json({ error: "You can't view your own story" });
    // }
    const updatedStory = await Stories.findByIdAndUpdate(
      storyId,
      { $addToSet: { views: _id } },
      { new: true }
    );
    if (!updatedStory)
      return res.status(404).json({ error: "Story not found" });
    res.status(200).json({ message: "Story viewed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

storyRouter.patch("/like/:storyId", userAuth, async (req, res) => {
  try {
    const { storyId } = req.params;
    const { _id } = req.user;

    // Validate storyId
    if (!validator.isMongoId(storyId)) {
      return res.status(400).json({ error: "Invalid storyId" });
    }

    const story = await Stories.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    // Prevent user from liking their own story
    // if (story.userId.toString() === _id.toString()) {
    //   return res.status(401).json({ error: "You can't like your own story" });
    // }

    // Check if the story is already liked by the user
    const alreadyLiked = story.likes.includes(_id);

    let updatedStory;
    if (alreadyLiked) {
      // Unlike the story
      updatedStory = await Stories.findByIdAndUpdate(
        storyId,
        { $pull: { likes: _id } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Story unliked successfully", liked: false });
    } else {
      // Like the story
      updatedStory = await Stories.findByIdAndUpdate(
        storyId,
        { $addToSet: { likes: _id } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Story liked successfully", liked: true });
    }
  } catch (err) {
    console.error("Error liking/unliking story:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

storyRouter.get("/getStories", userAuth, async (req, res) => {
  try {
    const { _id, following } = req.user;

    const stories = await Stories.find({
      $or: [
        { userId: _id }, // Fetch current user's stories
        { userId: { $in: following } }, // Fetch following users' stories
      ],
    }).populate("userId", "username profilePicture");

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = storyRouter;
