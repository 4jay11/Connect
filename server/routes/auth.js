const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/User");
const Post = require("../models/Post");
const Stories = require("../models/Stories");
// Register Route
authRouter.post("/register", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { email, password, username, profileVisibility = "public" } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already registered" });

    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      profileVisibility,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login Route
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, "secret", {
      expiresIn: "1d",
    });

    res.cookie("token", token);

    res.json({ message: "Login successful", user  });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Logout Route
authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.status(200).json({ message: "User logged out successfully" });
});

// Get All Users
authRouter.get("/allUser", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = authRouter;
