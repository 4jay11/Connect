import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiBookmark } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import PostPopUp from "../Post/PostPopUp";
import "./PostGrid.css";

const PostGrid = ({
  posts,
  currentUser,
  onLike,
  onBookmark,
  handlePostDelete,
  handlePostEdit,
  isCurrentUser,
}) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handlePostClick = (post, index) => {
    setSelectedPost(post);
    setCurrentIndex(index);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPost(null);
  };

  const handlePrevPost = () => {
    if (posts.length <= 1) return;
    const prevIndex = currentIndex === 0 ? posts.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedPost(posts[prevIndex]);
  };

  const handleNextPost = () => {
    if (posts.length <= 1) return;
    const nextIndex = (currentIndex + 1) % posts.length;
    setCurrentIndex(nextIndex);
    setSelectedPost(posts[nextIndex]);
  };

  const handleNavigate = (direction) => {
    if (direction === "prev") {
      handlePrevPost();
    } else if (direction === "next") {
      handleNextPost();
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="no-posts-message">
        <h3>No posts yet</h3>
        <p>
          {isCurrentUser
            ? "Share your first post with your friends!"
            : "This user hasn't posted anything yet."}
        </p>
        {isCurrentUser && (
          <button
            className="create-post-btn"
            onClick={() => navigate("/upload")}
          >
            Create Post
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="user-posts-grid">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className="post-grid-item"
            onClick={() => handlePostClick(post, index)}
          >
            <img
              src={post.image}
              alt={`Post by ${post.userId?.username || "user"}`}
              className="post-grid-image"
            />
            <div className="post-grid-overlay">
              <div className="post-grid-stats">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && selectedPost && (
        <PostPopUp
          post={selectedPost}
          onClose={closePopup}
          currentUser={currentUser}
          onLike={onLike}
          onBookmark={onBookmark}
          handlePostDelete={isCurrentUser ? handlePostDelete : null}
          handlePostEdit={isCurrentUser ? handlePostEdit : null}
          prevPost={posts.length > 1 ? true : false}
          nextPost={posts.length > 1 ? true : false}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};

export default PostGrid;
