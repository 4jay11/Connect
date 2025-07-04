import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Post from "./Post";
import PostShimmer from "./PostShimmer";
import "./Posts.css";

const Posts = ({ userId = null }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePostIndex, setActivePostIndex] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/post/post-generator";

      const res = await axios.get(url, { withCredentials: true });
      console.log(res.data);
      setPosts(res.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8000/post-reaction/like/${postId}`,
        {},
        { withCredentials: true }
      );

      // Update posts state to reflect the like
      setPosts((prevPosts) =>
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
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await axios.post(
        `http://localhost:8000/post-reaction/bookmark/${postId}`,
        {},
        { withCredentials: true }
      );

      // Update posts state to reflect the bookmark
      setPosts((prevPosts) =>
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
    } catch (err) {
      console.error("Error bookmarking post:", err);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/post/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handlePostEdit = (postId) => {
    // Implement post edit functionality or navigate to edit page
    console.log("Edit post:", postId);
  };

  const handlePostPopup = (index) => {
    setActivePostIndex(index);
  };

  const handleNavigatePost = (direction) => {
    if (direction === "prev" && activePostIndex > 0) {
      setActivePostIndex(activePostIndex - 1);
    } else if (direction === "next" && activePostIndex < posts.length - 1) {
      setActivePostIndex(activePostIndex + 1);
    }
  };

  const handleClosePopup = () => {
    setActivePostIndex(null);
  };

  if (loading) {
    return (
      <div className="posts-container">
        <PostShimmer />
        <PostShimmer />
        <PostShimmer />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <h3>No posts found</h3>
        <p>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post, index) => (
        <Post
          key={post._id}
          post={post}
          onLike={handleLike}
          onBookmark={handleBookmark}
          handlePostDelete={handlePostDelete}
          handlePostEdit={handlePostEdit}
          showPopupInitially={index === activePostIndex}
        />
      ))}

      {activePostIndex !== null && (
        <Post
          post={posts[activePostIndex]}
          onLike={handleLike}
          onBookmark={handleBookmark}
          handlePostDelete={handlePostDelete}
          handlePostEdit={handlePostEdit}
          showPopupInitially={true}
          prevPost={activePostIndex > 0 ? posts[activePostIndex - 1] : null}
          nextPost={
            activePostIndex < posts.length - 1
              ? posts[activePostIndex + 1]
              : null
          }
          onNavigate={handleNavigatePost}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Posts;
