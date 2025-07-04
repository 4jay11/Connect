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
import Bookmarks from "./components/Bookmark/Bookmarks";
import ProtectedRoute from "./ProtectedRoute";
import StoryUploader from "./components/Upload/StoryUploader";
import Chat from "./components/Chat/Chat";
import Explore from "./components/Explore/Explore";
import SinglePost from "./components/Post/SinglePost";

// Import our User components
import UserProfile from "./components/User/UserProfile";
import EditProfile from "./components/User/EditProfile";
import PageNotFound from "./components/SharedComponents/PageNotFound";
import ProfileNotFound from "./components/User/ProfileNotFound";
import { StoryPage } from "./components/StoryPage/StoryPage";
import { Highlights } from "./components/Highlights/Highlights";

const Routers = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.user);

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
          <Route path="/upload" element={<UploadPost />} />
          <Route path="/story-upload" element={<StoryUploader />} />
          <Route path="/bookmark" element={<Bookmarks />} />
          <Route path="/story-page/:id" element={<StoryPage />} />
          <Route path="/post/:postId" element={<SinglePost />} />
          <Route path="/highlights/:userId/:id" element={<Highlights />} />
          <Route path="/explore" element={<Explore />} />

          {/* User Profile Routes */}
          {/* <Route path="/profile" element={<UserProfile />} /> */}
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/chat/:targetUserId?" element={<Chat />} />

          {/* Not Found Route - Must be inside protected routes to have access to currentUser */}
          <Route
            path="*"
            element={<PageNotFound currentUser={currentUser} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;
