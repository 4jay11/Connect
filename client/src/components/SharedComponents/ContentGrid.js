import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ContentGrid.css";
import ContentCard from "./ContentCard";
import SidebarNav from "../Sidebar/SidebarNav";
import PostPopUp from "../Post/PostPopUp";

const ContentGrid = ({
  title,
  subtitle,
  posts,
  loading,
  handleLike,
  handleBookmark,
  handlePostDelete,
  handlePostEdit,
  onCommentSubmit,
  onDeleteComment,
}) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [showPopup, setShowPopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post, index) => {
    setSelectedPost(post);
    setCurrentIndex(index);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPost(null);
  };

  const handleNavigate = (direction) => {
    if (posts.length <= 1) return;

    if (direction === "prev") {
      const prevIndex =
        currentIndex === 0 ? posts.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedPost(posts[prevIndex]);
    } else if (direction === "next") {
      const nextIndex = (currentIndex + 1) % posts.length;
      setCurrentIndex(nextIndex);
      setSelectedPost(posts[nextIndex]);
    }
  };

  return (
    <div className="content-page no-navbar">
      <div className="content-wrapper">
        <SidebarNav className="content-sidebar" showSocialName={true} />

        <div className="content-main">
          <div className="content-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {loading ? (
            <div className="content-loading">
              <div className="loading-spinner"></div>
              <p>Loading content...</p>
            </div>
          ) : (
            <div className="content-grid">
              {posts && posts.length > 0 ? (
                posts.map((post, index) => (
                  <ContentCard
                    key={post._id}
                    post={post}
                    onClick={() => handlePostClick(post, index)}
                  />
                ))
              ) : (
                <div className="no-posts-message">
                  <p>No content available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPopup && selectedPost && (
        <PostPopUp
          post={selectedPost}
          comments={selectedPost.comments || []}
          onClose={closePopup}
          onLike={handleLike}
          onBookmark={handleBookmark}
          handlePostDelete={handlePostDelete}
          handlePostEdit={handlePostEdit}
          currentUser={currentUser}
          prevPost={
            currentIndex > 0 ? posts[currentIndex - 1] : posts[posts.length - 1]
          }
          nextPost={
            currentIndex < posts.length - 1 ? posts[currentIndex + 1] : posts[0]
          }
          onNavigate={handleNavigate}
          onCommentSubmit={(text) => onCommentSubmit(selectedPost._id, text)}
          onDeleteComment={onDeleteComment}
        />
      )}
    </div>
  );
};

export default ContentGrid;
