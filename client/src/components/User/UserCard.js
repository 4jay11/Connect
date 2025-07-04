import React, { useState } from "react";
import {
  FaEdit,
  FaCamera,
  FaUser,
  FaUsers,
  FaImage,
  FaComment,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { sendConnectionRequest } from "../../services/connectionApi";
import { createChat } from "../../services/chatApi";
import "./UserCard.css";

const UserCard = ({
  user,
  onEditProfile,
  postCount,
  isCurrentUser = false,
  currentUser,
}) => {
  const [isFollowing, setIsFollowing] = useState(
    currentUser &&
      user &&
      user.followers &&
      user.followers.includes(currentUser._id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="user-card skeleton">
        <div className="user-card-avatar skeleton-avatar"></div>
        <div className="user-card-info">
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    );
  }

  const {
    _id: userId,
    username = "User",
    bio = "No bio available",
    profilePicture = "https://via.placeholder.com/150",
    followers = [],
    following = [],
    isPublic = true,
  } = user;

  const handleFollowClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await sendConnectionRequest(userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await createChat(userId);
      navigate(`/messages/${userId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if chat button should be shown
  // Show chat if: user is public OR currentUser follows the user OR user follows currentUser
  const showChatButton =
    !isCurrentUser &&
    currentUser &&
    (isPublic ||
      (following && following.includes(currentUser._id)) ||
      (currentUser.following && currentUser.following.includes(userId)));

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-card-avatar-container">
          <img
            src={profilePicture}
            alt={username}
            className="user-card-avatar"
          />
          {isCurrentUser && (
            <div className="user-card-avatar-overlay">
              <FaCamera />
            </div>
          )}
        </div>

        <div className="user-card-actions">
          {isCurrentUser ? (
            <button className="edit-profile-btn" onClick={onEditProfile}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <>
              <button
                className={`follow-btn ${isFollowing ? "following" : ""}`}
                onClick={handleFollowClick}
                disabled={isLoading}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              {showChatButton && (
                <button
                  className="chat-btn"
                  onClick={handleChatClick}
                  disabled={isLoading}
                >
                  <FaComment /> Chat
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="user-card-info">
        <h2 className="user-card-name">{username}</h2>
        <p className="user-card-bio">{bio}</p>
      </div>

      <div className="user-card-stats">
        <div className="user-card-stat">
          <span className="stat-value">{postCount}</span>
          <span className="stat-label">
            <FaImage className="stat-icon" /> Posts
          </span>
        </div>
        <div className="user-card-stat">
          <span className="stat-value">{followers.length}</span>
          <span className="stat-label">
            <FaUsers className="stat-icon" /> Followers
          </span>
        </div>
        <div className="user-card-stat">
          <span className="stat-value">{following.length}</span>
          <span className="stat-label">
            <FaUser className="stat-icon" /> Following
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
