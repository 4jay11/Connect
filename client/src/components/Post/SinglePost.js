import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSinglePost, likePost, bookmarkPost } from "../../services/postApi";
import Post from "./Post";
import SidebarNav from "../Sidebar/SidebarNav";
import "./SinglePost.css";
import { FiMessageCircle, FiHeart } from "react-icons/fi";

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [post, setPost] = useState(null);
  const [userOtherPosts, setUserOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getSinglePost(postId);
        setPost(data.post);
        setUserOtherPosts(data.userOtherPosts);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(
          "Failed to load post. It may have been deleted or is unavailable."
        );
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleLike = async (postId) => {
    try {
      await likePost(postId);

      // Update the main post if it's the one being liked
      if (post._id === postId) {
        setPost((prevPost) => {
          const isLiked = prevPost.likes.some(
            (like) => like._id === currentUser._id
          );

          return {
            ...prevPost,
            likes: isLiked
              ? prevPost.likes.filter((like) => like._id !== currentUser._id)
              : [
                  ...prevPost.likes,
                  { _id: currentUser._id, username: currentUser.username },
                ],
          };
        });
      }

      // Update in other posts if needed
      setUserOtherPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p._id === postId) {
            const isLiked = p.likes.some(
              (like) => like._id === currentUser._id
            );

            return {
              ...p,
              likes: isLiked
                ? p.likes.filter((like) => like._id !== currentUser._id)
                : [
                    ...p.likes,
                    { _id: currentUser._id, username: currentUser.username },
                  ],
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await bookmarkPost(postId);

      // Update the main post if it's the one being bookmarked
      if (post._id === postId) {
        setPost((prevPost) => {
          const isBookmarked = prevPost.bookmarks.includes(currentUser._id);

          return {
            ...prevPost,
            bookmarks: isBookmarked
              ? prevPost.bookmarks.filter((id) => id !== currentUser._id)
              : [...prevPost.bookmarks, currentUser._id],
          };
        });
      }

      // Update in other posts if needed
      setUserOtherPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p._id === postId) {
            const isBookmarked = p.bookmarks.includes(currentUser._id);

            return {
              ...p,
              bookmarks: isBookmarked
                ? p.bookmarks.filter((id) => id !== currentUser._id)
                : [...p.bookmarks, currentUser._id],
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Error bookmarking post:", err);
    }
  };

  const handlePostDelete = async (postId) => {
    // Not implementing delete in this view
    // User would be redirected to home if they delete the main post
  };

  const handlePostEdit = async (postId, newCaption) => {
    // Not implementing edit in this view
  };

  const handleUserProfile = () => {
    if (post && post.userId) {
      navigate(`/profile/${post.userId._id}`);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="single-post-page">
      <div className="single-post-layout">
        <div className="sidebar-container">
          <SidebarNav showSocialName={true} />
        </div>

        <div className="single-post-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading post...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button
                className="back-to-home"
                onClick={() => navigate("/feed")}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <div className="main-post-container">
                {post && (
                  <Post
                    post={post}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    handlePostDelete={handlePostDelete}
                    handlePostEdit={handlePostEdit}
                    showPopupInitially={showComments}
                    disableNavigation={true}
                  />
                )}
              </div>

              {post && post.userId && (
                <div className="post-author-section">
                  <div className="post-author-header">
                    <div
                      className="post-author-info"
                      onClick={handleUserProfile}
                    >
                      <img
                        src={
                          post.userId.profilePicture ||
                          "https://via.placeholder.com/50"
                        }
                        alt={post.userId.username}
                        className="post-author-avatar"
                      />
                      <div>
                        <h3 className="post-author-name">
                          {post.userId.username}
                        </h3>
                        <p className="post-author-bio">View profile</p>
                      </div>
                    </div>
                    <button
                      className="view-comments-btn"
                      onClick={toggleComments}
                    >
                      <FiMessageCircle /> View Comments
                    </button>
                  </div>
                </div>
              )}

              {userOtherPosts.length > 0 && (
                <div className="other-posts-section">
                  <h2 className="other-posts-title">
                    More posts from {post?.userId?.username}
                  </h2>
                  <div className="other-posts-grid">
                    {userOtherPosts.map((otherPost) => (
                      <div
                        key={otherPost._id}
                        className="other-post-item"
                        onClick={() => navigate(`/post/${otherPost._id}`)}
                      >
                        <img
                          src={otherPost.image}
                          alt={otherPost.content}
                          className="other-post-image"
                        />
                        <div className="other-post-overlay">
                          <div className="other-post-stats">
                            <span>
                              <FiHeart /> {otherPost.likes.length}
                            </span>
                            <span>
                              <FiMessageCircle /> {otherPost.comments.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
