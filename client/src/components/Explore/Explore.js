import React, { useEffect, useState } from "react";
import {
  getFeedPosts,
  likePost,
  bookmarkPost,
  addComment,
  deleteComment,
} from "../../services";
import ContentGrid from "../SharedComponents/ContentGrid";

const Explore = () => {
  const [explorePosts, setExplorePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        setLoading(true);
        const data = await getFeedPosts();
        // Ensure we have all the required data for each post
        const posts = data.map((post) => ({
          ...post,
          likes: post.likes || [],
          bookmarks: post.bookmarks || [],
          comments: Array.isArray(post.comments)
            ? post.comments.map((comment) => ({
                ...comment,
                userId: comment.userId || {
                  _id: "",
                  username: "Unknown User",
                  profilePicture: "",
                },
              }))
            : [],
          userId: post.userId || {
            _id: "",
            username: "Unknown User",
            profilePicture: "",
          },
        }));
        setExplorePosts(posts || []);
      } catch (err) {
        console.error("Error fetching Explore:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExplore();
  }, [refreshTrigger]);

  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);
      if (res) {
        setRefreshTrigger((prev) => !prev);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const res = await bookmarkPost(postId);
      if (res) {
        setRefreshTrigger((prev) => !prev);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handlePostDelete = async (id) => {
    try {
      // await deletePost(id);
      console.log("Post deleted successfully");
      setExplorePosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete post:", err.message);
    }
  };

  const handlePostEdit = async (id, text) => {
    try {
      // await updatePost(id, text);
      setExplorePosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === id) {
            return { ...post, content: text };
          }
          return post;
        })
      );
    } catch (err) {
      console.error(
        "Failed to edit post:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleCommentSubmit = async (postId, commentText) => {
    try {
      await addComment(postId, commentText);
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Failed to add comment:", err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error("Failed to delete comment:", err.message);
    }
  };

  return (
    <ContentGrid
      title="Explore"
      subtitle="Discover amazing content from around the world"
      posts={explorePosts}
      loading={loading}
      handleLike={handleLike}
      handleBookmark={handleBookmark}
      handlePostDelete={handlePostDelete}
      handlePostEdit={handlePostEdit}
      onCommentSubmit={handleCommentSubmit}
      onDeleteComment={handleDeleteComment}
    />
  );
};

export default Explore;
