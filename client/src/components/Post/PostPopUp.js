import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import PostComments from "./PostComments";
import "./PostPopUp.css";

const PostPopUp = ({
  post,
  comments = [],
  isLoading = false,
  onClose,
  onCommentSubmit,
  onDeleteComment,
  currentUser,
  onLike,
  onBookmark,
  handlePostDelete,
  handlePostEdit,
  prevPost = null,
  nextPost = null,
  onNavigate = null,
}) => {
  const {
    _id: post_id,
    userId,
    content: caption,
    image: feedPhoto,
    location,
    createdAt,
    likes = [],
    bookmarks = [],
  } = post;

  const [isExpanded, setIsExpanded] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && prevPost && onNavigate) {
        onNavigate("prev");
      } else if (e.key === "ArrowRight" && nextPost && onNavigate) {
        onNavigate("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, prevPost, nextPost, onNavigate]);

  // Format the time ago string
  const timeAgo = formatTimeAgo(createdAt);

  // Check if the post is editable by the current user
  const editable = currentUser && userId && currentUser._id === userId._id;

  // Check if post is liked or bookmarked
  const isLiked = likes.includes(currentUser?._id);
  const isBookmarked = bookmarks.includes(currentUser?._id);

  const handleLikeClick = () => {
    onLike && onLike(post_id);
  };

  const handleBookmarkClick = () => {
    onBookmark && onBookmark(post_id);
  };

  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };

  const isCaptionLong = caption && caption.length > 100;

  return (
    <div className="post-popup-overlay" onClick={onClose}>
      <div
        className="post-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="post-popup-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Navigation buttons */}
        {prevPost && onNavigate && (
          <button
            className="post-popup-nav post-popup-prev"
            onClick={() => onNavigate("prev")}
          >
            <FaChevronLeft />
          </button>
        )}

        {nextPost && onNavigate && (
          <button
            className="post-popup-nav post-popup-next"
            onClick={() => onNavigate("next")}
          >
            <FaChevronRight />
          </button>
        )}

        <div className="post-popup-content">
          <div className="post-popup-image">
            {feedPhoto && <img src={feedPhoto} alt="Post" />}

            {caption && (
              <div className="post-popup-image-caption">
                <div
                  className={`caption-content ${isExpanded ? "expanded" : ""}`}
                >
                  {isExpanded || !isCaptionLong
                    ? caption
                    : `${caption.substring(0, 100)}...`}
                </div>
                {isCaptionLong && (
                  <button className="caption-toggle" onClick={toggleCaption}>
                    {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
                  </button>
                )}
              </div>
            )}

            <div className="post-popup-image-actions">
              <button
                className={`post-popup-action-btn ${isLiked ? "active" : ""}`}
                onClick={handleLikeClick}
              >
                {isLiked ? <FaHeart className="heart-icon" /> : <FaRegHeart />}
              </button>
              <button
                className={`post-popup-action-btn ${
                  isBookmarked ? "active" : ""
                }`}
                onClick={handleBookmarkClick}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
          </div>

          <div className="post-popup-details">
            <div className="post-popup-header">
              <div className="post-popup-user">
                <img
                  className="post-popup-user-photo"
                  src={
                    userId?.profilePicture || "https://via.placeholder.com/40"
                  }
                  alt={userId?.username || "User"}
                />
                <div className="post-popup-user-info">
                  <h4 className="post-popup-username">
                    {userId?.username || "Unknown User"}
                  </h4>
                  <div className="post-popup-meta">
                    {location && (
                      <span className="post-popup-location">{location}</span>
                    )}
                    <span className="post-popup-time">{timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>

            <PostComments
              comments={comments}
              onCommentSubmit={onCommentSubmit}
              onDeleteComment={onDeleteComment}
              currentUser={currentUser}
              isLoading={isLoading}
              isPopup={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTimeAgo = (dateString) => {
  if (!dateString) return "recently";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export default PostPopUp;
