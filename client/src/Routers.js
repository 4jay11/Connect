import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import App from "./App";
import UploadPost from "./components/Upload/UploadPost";
import Profile from "./components/Profile/Profile";
import Bookmarks from "./components/Bookmark/Bookmarks";
import ProfileSection from "./components/Profile/ProfileSection";
import ProtectedRoute from "./ProtectedRoute";
import StoryView from "./components/Stories/StoryView";
import StoryUploader from "./components/Stories/StoryUploader";
import Chat from "./components/Chat/Chat";
import Explore from "./components/Explore/Explore";
import HighlightView from "./components/Highlights/HighlightView";

const Routers = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/feed" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/feed" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/feed" />}
        />

        <Route
          path="/forgot-password"
          element={
            !isAuthenticated ? (
              <div>Forgot Password Page</div>
            ) : (
              <Navigate to="/feed" />
            )
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<App />} />
          <Route path="/profile/:id" element={<ProfileSection />} />
          <Route path="/upload" element={<UploadPost />} />
          <Route path="/story-upload" element={<StoryUploader />} />
          <Route path="/bookmark" element={<Bookmarks />} />
          <Route path="/storyView/:id" element={<StoryView />} />
          <Route
            path="/highlights/:userId/:highlightId"
            element={<HighlightView />}
          />
          <Route
            path="/highlights/:userId/:highlightId/:storyId"
            element={<HighlightView />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:targetUserId?" element={<Chat />} />
        </Route>

        {/* Catch-all Route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/feed" : "/"} />}
        />
      </Routes>
    </Router>
  );
};

export default Routers;
