const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const connectionRouter = require("./routes/connection");
const postReactionRouter = require("./routes/post-reactions");
const userRouter = require("./routes/user");
const storyRouter = require("./routes/stories");
const highlightRouter = require("./routes/highlight");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const app = express();
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
app.use(cookieParser());
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    credentials: true, // Allow cookies and Authorization headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Mount Routes
app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/story", storyRouter);
app.use("/highlight", highlightRouter);
app.use("/connection", connectionRouter);
app.use("/post-reaction", postReactionRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);
// Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
