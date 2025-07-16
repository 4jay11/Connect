import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import UserCard from "./UserCard";
import UserHighlights from "./UserHighlights";
import PostGrid from "./PostGrid";
import ProfileNotFound from "./ProfileNotFound";
import UserNotFound from "./UserNotFound";
import { getUserProfile } from "../../services/userApi";
import "./UserProfile.css";

const UserProfile = () => {
  const { id } = useParams(); // Get user ID from URL params
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [userNotFound, setUserNotFound] = useState(false);

  // Determine if we're viewing the current user's profile or another user's profile
  const isCurrentUser = !id || id === currentUser._id;
  const userId = id || currentUser._id;

  useEffect(() => {
    // If no ID parameter is provided and we're on /profile/:id route, show ProfileNotFound
    if (!id && window.location.pathname.startsWith("/profile/")) {
      return;
    }

    // If ID is provided but not in valid MongoDB ObjectId format
    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      setUserNotFound(true);
      return;
    }

    fetchUserData();
  }, [id, userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // If it's the current user, we already have the data
      if (isCurrentUser) {
        setProfileUser(currentUser);
        setLoading(false);
        // Still need to fetch posts for current user
        const response = await getUserProfile(currentUser._id);
        if (response && response.posts) {
          setUserPosts(response.posts);
        }
        return;
      }

      // Otherwise, fetch the user data using the service
      const response = await getUserProfile(userId);

      if (response && response.user) {
        setProfileUser(response.user);
        setUserPosts(response.posts || []);
      } else {
        setUserNotFound(true);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      // If user not found or any other error, set userNotFound to true
      setUserNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/post-reaction/like/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update posts state to reflect the like
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const userLiked = post.likes.includes(currentUser._id);
              return {
                ...post,
                likes: userLiked
                  ? post.likes.filter((id) => id !== currentUser._id)
                  : [...post.likes, currentUser._id],
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/post-reaction/bookmark/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update posts state to reflect the bookmark
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              const userBookmarked = post.bookmarks.includes(currentUser._id);
              return {
                ...post,
                bookmarks: userBookmarked
                  ? post.bookmarks.filter((id) => id !== currentUser._id)
                  : [...post.bookmarks, currentUser._id],
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error("Error bookmarking post:", err);
    }
  };

  const handlePostDelete = async (postId) => {
    // Only allow delete if it's the current user's profile
    if (!isCurrentUser) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/post/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handlePostEdit = (postId) => {
    // Only allow edit if it's the current user's profile
    if (!isCurrentUser) return;

    navigate(`/edit-post/${postId}`);
  };

  const handleEditProfile = () => {
    // Only allow edit if it's the current user's profile
    if (!isCurrentUser) return;

    navigate("/edit-profile");
  };

  // If we're on /profile/ without a valid ID, show ProfileNotFound
  if (!id && window.location.pathname.startsWith("/profile/")) {
    return <ProfileNotFound currentUser={currentUser} />;
  }

  // If user ID is invalid format or user doesn't exist, show UserNotFound
  if (userNotFound) {
    return <UserNotFound currentUser={currentUser} userId={id || "invalid"} />;
  }

  // Show loading state if profile user data is not yet loaded
  if (loading || !profileUser) {
    return (
      <>
        <Navbar currentUser={currentUser} />
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="user-profile-container">
        <div className="user-profile-left">
          <UserCard
            user={profileUser}
            onEditProfile={handleEditProfile}
            postCount={userPosts.length}
            isCurrentUser={isCurrentUser}
            currentUser={currentUser}
          />
        </div>

        <div className="user-profile-right">
          <div className="user-profile-highlights">
            <UserHighlights userId={userId} />
          </div>

          <div className="user-profile-tabs">
            <button
              className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            {isCurrentUser && (
              <button
                className={`tab-button ${
                  activeTab === "saved" ? "active" : ""
                }`}
                onClick={() => setActiveTab("saved")}
              >
                Saved
              </button>
            )}
            <button
              className={`tab-button ${activeTab === "tagged" ? "active" : ""}`}
              onClick={() => setActiveTab("tagged")}
            >
              Tagged
            </button>
          </div>

          <div className="user-profile-content">
            {loading ? (
              <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : (
              <PostGrid
                posts={userPosts}
                currentUser={currentUser}
                onLike={handleLike}
                onBookmark={handleBookmark}
                handlePostDelete={handlePostDelete}
                handlePostEdit={handlePostEdit}
                isCurrentUser={isCurrentUser}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
