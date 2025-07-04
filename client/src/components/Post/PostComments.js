import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaSmile, FaPaperPlane } from "react-icons/fa";
import "./PostComments.css";

const PostComments = ({
  comments = [],
  onCommentSubmit,
  onDeleteComment,
  currentUser,
  isLoading = false,
  isPopup = false,
}) => {
  const [commentText, setCommentText] = useState("");
  const commentsContainerRef = useRef(null);

  // Scroll to bottom of comments when new ones are added
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onCommentSubmit(commentText);
      setCommentText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canDeleteComment = (comment) => {
    return (
      currentUser &&
      comment.userId &&
      (currentUser._id === comment.userId._id ||
        (comment.postId?.userId && currentUser._id === comment.postId.userId))
    );
  };

  return (
    <div className={`post-comments-section ${isPopup ? "popup-comments" : ""}`}>
      <h3 className="comments-title">Comments</h3>

      <div className="comments-container" ref={commentsContainerRef}>
        {isLoading ? (
          <div className="comments-loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-user-photo">
                <img
                  src={
                    comment.userId?.profilePicture ||
                    "https://via.placeholder.com/30"
                  }
                  alt={comment.userId?.username || "User"}
                />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">
                    {comment.userId?.username || "Unknown User"}
                  </span>
                  <span className="comment-time">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
              {canDeleteComment(comment) && (
                <button
                  className="delete-comment-btn"
                  onClick={() => onDeleteComment(comment._id)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="comment-form-container">
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-input-container">
            <textarea
              className="comment-input"
              placeholder="Add a comment..."
              value={commentText}
              onChange={handleCommentChange}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button type="button" className="emoji-btn">
              <FaSmile />
            </button>
          </div>
          <button
            type="submit"
            className="post-comment-btn"
            disabled={!commentText.trim()}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTimeAgo = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}w`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}mo`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}y`;
  }
};

export default PostComments;
