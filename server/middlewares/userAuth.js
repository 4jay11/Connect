const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "User not logged in" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    // console.log("Decoded Token:", decoded);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(decoded._id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    // Fetch user from DB
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    res.status(401).json({ error: "Authentication failed: " + err.message });
  }
};

module.exports = userAuth;
