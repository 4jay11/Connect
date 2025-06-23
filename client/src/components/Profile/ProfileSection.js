import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import ProfileCard from "./ProfileCard";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import FeedCard from "../Feed/FeedCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";
import "./ProfileSection.css";
import { uploadFile } from "../../utils/post";  
import {
  getUserProfile,
  getUserHighlights,
  deletePost,
  updatePost,
} from "../../services";
import { likePost, bookmarkPost } from "../../services/postApi";

// Local FeedNavigationButton component
const FeedNavigationButton = ({ direction = "left", onClick, children }) => {
  const isLeft = direction === "left";

  const style = {
    position: "absolute",
    height: "40px",
    width: "40px",
    top: "44%",
    [isLeft ? "left" : "right"]: "10px",
    transform: "translateY(-50%)",
    zIndex: 10,
    backgroundColor: "white",
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    padding: "6px 0 0 0",
  };

  return (
    <button onClick={onClick} style={style}>
      {children}
    </button>
  );
};

const ProfileSection = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  const handlePostDelete = async (id) => {
    try {
      await deletePost(id);
      console.log("Post deleted successfully");
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err.message);
    }
  };

  const handlePostEdit = async (id, text) => {
    try {
      await updatePost(id, text);
      // Update the post in the UI
      setPosts((prevPosts) =>
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile(id);
        setCurrentUser(response.user);
        setPosts(response.posts);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    const fetchHighlights = async () => {
      try {
        const highlights = await getUserHighlights(id);
        setHighlights(highlights);
      } catch (err) {
        console.error("Error fetching highlights:", err.message);
      }
    };

    fetchUser();
    fetchHighlights();
  }, [id, refreshTrigger]);

  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);
      if (res) {
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const res = await bookmarkPost(postId);
      if (res) {
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error Bookmarking post:", error);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const selectedPost = posts[currentIndex];

  const handleHighlightClick = (highlightId) => {
    navigate(`/highlights/${id}/${highlightId}`);
  };

  return (
    <div>
      {currentUser ? (
        <>
          <Navbar currentUser={currentUser} />
          <div className="main">
            <div className="container">
              <div className="left">
                <ProfileCard currentUser={currentUser} posts={posts} />
              </div>
              <div className="right">
                <p>Highlights</p>
                <div className="highlights">
                  {highlights.length > 0 ? (
                    highlights.map((highlight) => (
                      <div
                        className="highlight-item"
                        key={highlight._id}
                        onClick={() => handleHighlightClick(highlight._id)}
                      >
                        <div className="highlight-cover">
                          <img
                            src={
                              highlight.coverImage ||
                              highlight.stories[0]?.image
                            }
                            alt={highlight.name}
                          />
                        </div>
                        <span className="highlight-name">{highlight.name}</span>
                      </div>
                    ))
                  ) : (
                    <p>No highlights available</p>
                  )}
                </div>
                <p>Posts</p>
                <div className="book-container">
                  {posts.length > 0 ? (
                    posts.map((post, index) => (
                      <div
                        className="book-list"
                        key={post._id}
                        onClick={() => {
                          setCurrentIndex(index);
                          setShowFeedPopup(true);
                        }}
                      >
                        <div className="photo">
                          <img src={post.image} alt={`Post ${post._id}`} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No posts available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfileSection;