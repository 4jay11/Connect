import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostContent from "./PostContent";
import PostComments from "./PostComments";
import PostPopUp from "./PostPopUp";
import "./Post.css";

const Post = ({
  post,
  onLike,
  onBookmark,
  handlePostDelete,
  handlePostEdit,
  showPopupInitially = false,
  disableNavigation = false,
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

  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [showPopup, setShowPopup] = useState(showPopupInitially);
  const [isLoading, setIsLoading] = useState(false);

  // Format the time ago string
  const timeAgo = formatTimeAgo(createdAt);

  // Check if the post is editable by the current user
  const editable = currentUser && userId && currentUser._id === userId._id;

  // Update showPopup when showPopupInitially prop changes
  useEffect(() => {
    setShowPopup(showPopupInitially);
  }, [showPopupInitially]);

  useEffect(() => {
    if (showPopup) {
      fetchComments();
    }
  }, [showPopup, post_id]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/post/comments/${post_id}`,
        {
          withCredentials: true,
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (newComment) => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/post-reaction/comment/${post_id}`,
        { text: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data.comment]);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:8000/post-reaction/comment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== commentId)
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const openPopup = () => {
    setShowPopup(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setShowPopup(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="post-card">
        <PostContent
          profilePhoto={
            userId?.profilePicture || "https://via.placeholder.com/40"
          }
          username={userId?.username || "Unknown User"}
          location={location || "Unknown Location"}
          timeAgo={timeAgo}
          feedPhoto={feedPhoto}
          caption={caption}
          likedBy={likes}
          bookmarkBy={bookmarks}
          post_id={post_id}
          user_id={userId?._id}
          onLike={onLike}
          onBookmark={onBookmark}
          editable={editable}
          handlePostDelete={handlePostDelete}
          handlePostEdit={handlePostEdit}
          onViewComments={openPopup}
          navigate={navigate}
          disableNavigation={disableNavigation}
        />
      </div>

      {showPopup && (
        <PostPopUp
          post={post}
          comments={comments}
          isLoading={isLoading}
          onClose={closePopup}
          onCommentSubmit={handleCommentSubmit}
          onDeleteComment={handleDeleteComment}
          currentUser={currentUser}
          onLike={onLike}
          onBookmark={onBookmark}
          handlePostDelete={handlePostDelete}
          handlePostEdit={handlePostEdit}
        />
      )}
    </>
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

export default Post;
