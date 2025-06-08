import React, { useEffect, useState } from "react";
import "./Explore.css";
import ExploreCard from "./ExploreCard";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import StickySidebar from "../Sidebar/StickySidebar";
import { useSelector } from "react-redux";
import FeedPopup from "../Feed/FeedPopup";

const Explore = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [explorePosts, setExplorePosts] = useState([]);
  const [showFeedPopup, setShowFeedPopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/post/post-generator",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setExplorePosts(response.data || []);
      } catch (err) {
        console.error("Error fetching Explore:", err.message);
      }
    };

    fetchExplore();
  }, [refreshTrigger]);

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
      if (res.status === 200 || res.status === 201) {
        setRefreshTrigger((prev) => !prev);
      }
    } catch (err) {
      console.log(err.message);
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
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="book">
      <Navbar />
      <div className="bookmark-page" style={{ marginTop: "80px" }}>
        <div className="left">
          <StickySidebar />
        </div>
        <div className="right">
          <div className="book-title">
            <h1 className="bookmarks">Explore</h1>
          </div>
          <div className="explore-container">
            {explorePosts.length ? (
              explorePosts.map((post, index) => (
                <ExploreCard
                  key={post._id}
                  bookmarkPhoto={post.image}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowFeedPopup(true);
                  }}
                />
              ))
            ) : (
              <p>No posts found</p>
            )}
          </div>
        </div>

        {showFeedPopup && (
          <FeedPopup
            posts={explorePosts}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            onClose={() => {
              setShowFeedPopup(false);
              setCurrentIndex(null);
            }}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        )}
      </div>
    </div>
  );
};

export default Explore;