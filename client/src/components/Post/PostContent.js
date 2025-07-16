import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaShare,
} from "react-icons/fa";
import "./PostContent.css";
const PostContent = ({
  profilePhoto,
  username,
  location,
  timeAgo,
  feedPhoto,
  caption,
  likedBy = [],
  bookmarkBy = [],
  post_id,
  user_id,
  onLike,
  onBookmark,
  editable,
  handlePostDelete,
  handlePostEdit,
  onViewComments,
  navigate,
  isPopup = false,
  disableNavigation = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const isLiked = likedBy.includes(user_id);
  const isBookmarked = bookmarkBy.includes(user_id);
  const likeCount = likedBy.length;

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleProfileClick = () => {
    navigate && navigate(`/profile/${username}`);
  };

  const handleLikeClick = () => {
    onLike && onLike(post_id);
  };

  const handleBookmarkClick = () => {
    onBookmark && onBookmark(post_id);
  };

  const handleEdit = () => {
    handlePostEdit && handlePostEdit(post_id);
    setShowOptions(false);
  };

  const handleDelete = () => {
    handlePostDelete && handlePostDelete(post_id);
    setShowOptions(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${process.env.REACT_APP_API_URL}/post/${post_id}`);
    alert("Link copied to clipboard!");
    setShowOptions(false);
  };

  const handleImageClick = () => {
    if (disableNavigation || !navigate) return;
    navigate(`/post/${post_id}`);
  };

  return (
    <div className="post-content">
      <div className="post-header">
        <div className="post-user-info" onClick={handleProfileClick}>
          <img
            className="post-profile-photo"
            src={profilePhoto}
            alt={username}
          />
          <div className="post-user-details">
            <h4 className="post-username">{username}</h4>
            <div className="post-meta">
              {location && <span className="post-location">{location}</span>}
              <span className="post-time">{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="post-options-container">
          <button className="post-options-btn" onClick={toggleOptions}>
            <FaEllipsisV />
          </button>

          {showOptions && (
            <div className="post-options-menu">
              {editable && (
                <>
                  <button className="post-option-item" onClick={handleEdit}>
                    <FaEdit /> Edit
                  </button>
                  <button className="post-option-item" onClick={handleDelete}>
                    <FaTrash /> Delete
                  </button>
                </>
              )}
              <button className="post-option-item" onClick={handleShare}>
                <FaShare /> Share
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-image-container">
        {feedPhoto && (
          <img
            className="post-image"
            src={feedPhoto}
            alt="Post"
            onClick={handleImageClick}
            style={{
              cursor: !disableNavigation && navigate ? "pointer" : "default",
            }}
          />
        )}
      </div>

      {/* Action buttons below the image */}
      <div className="post-actions-bar">
        <div className="post-actions-left">
          <button
            className={`post-action-btn ${isLiked ? "active" : ""}`}
            onClick={handleLikeClick}
          >
            {isLiked ? <FaHeart className="heart-icon" /> : <FaRegHeart />}
          </button>
          <button className="post-action-btn" onClick={onViewComments}>
            <FaRegComment />
          </button>
        </div>
        <div>
          <button
            className={`post-action-btn ${isBookmarked ? "active" : ""}`}
            onClick={handleBookmarkClick}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      <div className="post-details">
        {likeCount > 0 && (
          <div className="post-likes">
            <span>
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </div>
        )}

        {caption && <div className="post-caption">{caption}</div>}
      </div>
    </div>
  );
};

export default PostContent;
