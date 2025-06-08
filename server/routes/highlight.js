const express = require("express");
const router = express.Router();
const Highlight = require("../models/Highlight");
const Stories = require("../models/Stories");
const auth = require("../middlewares/userAuth");

// Create a new highlight
router.post("/create", auth, async (req, res) => {
  try {
    const { name, storyId, coverImage } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Highlight name is required" });
    }

    if (name.length > 30) {
      return res
        .status(400)
        .json({ message: "Highlight name must be less than 30 characters" });
    }

    // Check if highlight with same name already exists for this user
    const existingHighlight = await Highlight.findOne({
      userId: req.user.id,
      name: name,
    });

    if (existingHighlight) {
      return res
        .status(400)
        .json({ message: "You already have a highlight with this name" });
    }

    // Validate story if provided
    if (storyId) {
      const story = await Stories.findById(storyId);
      if (!story) {
        return res
          .status(404)
          .json({ message: "Story not found or has expired" });
      }
      if (story.userId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only add your own stories to highlights" });
      }
    }

    // Create new highlight
    const highlight = new Highlight({
      userId: req.user.id,
      name,
      coverImage: coverImage || "",
      stories: storyId ? [storyId] : [],
    });

    await highlight.save();

    res.status(201).json({
      message: "Highlight created successfully",
      highlight,
    });
  } catch (error) {
    console.error("Error creating highlight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =================================
// Get highlights for specific user
// =================================
router.get("/user/:userId", async (req, res) => {
  try {
    const highlights = await Highlight.find({
      userId: req.params.userId,
    }).populate({
      path: "stories",
      select: "image content createdAt",
      options: { sort: { createdAt: -1 } },
    });


    res.json(highlights);
  } catch (error) {
    console.error("Error fetching user highlights:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// ================================
// Add a story to a highlight
// ================================
router.patch("/add-story", auth, async (req, res) => {
  try {
    const { highlightId, storyId } = req.body;

    if (!highlightId || !storyId) {
      return res.status(400).json({ message: "Highlight ID and Story ID are required" });
    }

    const [highlight, story] = await Promise.all([
      Highlight.findById(highlightId),
      Stories.findById(storyId),
    ]);

    if (!highlight || highlight.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or highlight not found" });
    }

    if (!story || story.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or story not found/expired" });
    }

    if (highlight.stories.includes(storyId)) {
      return res.status(400).json({ message: "Story already in this highlight" });
    }

    highlight.stories.push(storyId);
    if (!highlight.coverImage) highlight.coverImage = story.image;

    await highlight.save();

    res.json({ message: "Story added to highlight", highlight });
  } catch (error) {
    console.error("Error adding story to highlight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================================
// Remove a story from a highlight
// ================================
router.patch("/remove-story", auth, async (req, res) => {
  try {
    const { highlightId, storyId } = req.body;

    if (!highlightId || !storyId) {
      return res.status(400).json({ message: "Highlight ID and Story ID are required" });
    }

    const highlight = await Highlight.findById(highlightId);
    if (!highlight || highlight.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or highlight not found" });
    }

    highlight.stories = highlight.stories.filter(id => id.toString() !== storyId);

    if (!highlight.coverImage || highlight.stories.length === 0) {
      const first = await Stories.findById(highlight.stories[0]);
      highlight.coverImage = first?.image || "";
    }

    await highlight.save();

    res.json({ message: "Story removed from highlight", highlight });
  } catch (error) {
    console.error("Error removing story from highlight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================================
// Update a highlight
// ================================
router.patch("/:id", auth, async (req, res) => {
  try {
    const { name, coverImage } = req.body;
    const highlight = await Highlight.findById(req.params.id);

    if (!highlight || highlight.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or highlight not found" });
    }

    if (name && name.length > 30) {
      return res.status(400).json({ message: "Highlight name must be under 30 characters" });
    }

    if (name && name !== highlight.name) {
      const duplicate = await Highlight.findOne({
        userId: req.user.id,
        name,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(400).json({ message: "Highlight name already exists" });
      }
      highlight.name = name;
    }

    if (coverImage) {
      highlight.coverImage = coverImage;
    }

    await highlight.save();

    res.json({ message: "Highlight updated", highlight });
  } catch (error) {
    console.error("Error updating highlight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================================
// Delete a highlight
// ================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const highlight = await Highlight.findById(req.params.id);

    if (!highlight || highlight.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or highlight not found" });
    }

    await Highlight.findByIdAndDelete(req.params.id);

    res.json({ message: "Highlight deleted" });
  } catch (error) {
    console.error("Error deleting highlight:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

