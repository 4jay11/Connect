import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import ProfileCard from "./ProfileCard";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import FeedCard from "../Feed/FeedCard";
import { FeedNavigationButton } from "../Feed/FeedPopup";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";
import "./ProfileSection.css";

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
      const res = await axios.delete(
        `http://localhost:8000/post/deletePost/${id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Post deleted successfully");
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err.message);
    }
  };

  const handlePostEdit = async (id, text) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/post/update/${id}`,
        { caption: text },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Post updated:", res.data);

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
        const response = await axios.get(`http://localhost:8000/user/${id}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setCurrentUser(response.data.user);
        setPosts(response.data.posts);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    const fetchHighlights = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/highlight/user/${id}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setHighlights(response.data);
      } catch (err) {
        console.error("Error fetching highlights:", err.message);
      }
    };

    fetchUser();
    fetchHighlights();
  }, [id, refreshTrigger]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/post-reaction/like/${postId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setRefreshTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/post-reaction/bookmark/${postId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
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

          {/* Feed Popup Overlay */}
          {showFeedPopup && selectedPost && (
            <div className="feed-popup-overlay">
              <div className="feed-popup-content">
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowFeedPopup(false);
                    setCurrentIndex(null);
                  }}
                >
                  ✖
                </button>

                <FeedNavigationButton direction="left" onClick={handlePrev}>
                  <FaArrowLeft />
                </FeedNavigationButton>

                <FeedCard
                  key={selectedPost._id}
                  user_id={currentUser?._id}
                  post_id={selectedPost._id}
                  profilePhoto={currentUser?.profilePicture || ""}
                  username={currentUser?.username || "Unknown User"}
                  location={selectedPost.location || "Unknown Location"}
                  timeAgo={formatDistanceToNow(
                    parseISO(selectedPost.createdAt),
                    {
                      addSuffix: true,
                    }
                  )}
                  feedPhoto={selectedPost.image || ""}
                  likedBy={selectedPost.likes || []}
                  bookmarkBy={selectedPost.bookmarks || []}
                  caption={selectedPost.content || "No caption"}
                  onBookmark={handleBookmark}
                  onLike={handleLike}
                  editable={true}
                  handlePostDelete={handlePostDelete}
                  handlePostEdit={handlePostEdit}
                />

                <FeedNavigationButton direction="right" onClick={handleNext}>
                  <FaArrowRight />
                </FeedNavigationButton>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfileSection;