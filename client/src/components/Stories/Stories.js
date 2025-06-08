import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "./Stories.css";
import ShimmerStory from "../ShimmerUI/StoryShimmer";
import axios from "axios";
import StoryUpload from "./StoryUpload";

const Stories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hasUserStory, setHasUserStory] = useState(false);

  useEffect(() => {
    // Get current user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setCurrentUserId(user._id);
    }
  }, []);

  const getStories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/story/getStories",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setStories(response.data);

      // Check if current user has a story
      if (currentUserId) {
        const userHasStory = response.data.some(
          (story) => story.userId._id === currentUserId
        );
        setHasUserStory(userHasStory);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching Stories: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      getStories();
    }
  }, [currentUserId]);

  const handleStoryView = (id) => {
    navigate(`/storyView/${id}`);
  };

  // Group stories by user, keeping only the most recent story per user
  const uniqueUserStories = Object.values(
    stories.reduce((acc, story) => {
      const userId = story.userId._id;
      // If this user's story doesn't exist in accumulator or this story is newer, add it
      if (
        !acc[userId] ||
        new Date(story.createdAt) > new Date(acc[userId].createdAt)
      ) {
        acc[userId] = story;
      }
      return acc;
    }, {})
  );

  // Sort stories: current user first, then others by creation time (newest first)
  const sortedStories = [...uniqueUserStories].sort((a, b) => {
    // If a is current user's story, it comes first
    if (a.userId._id === currentUserId) return -1;
    // If b is current user's story, it comes first
    if (b.userId._id === currentUserId) return 1;
    // Otherwise sort by creation time (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="middle" style={{ width: "36rem", height: "12rem" }}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          620: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {/* Only show StoryUpload if user doesn't have a story and not loading */}
        {!hasUserStory && !loading && (
          <SwiperSlide>
            <StoryUpload />
          </SwiperSlide>
        )}

        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SwiperSlide key={index}>
                <ShimmerStory />
              </SwiperSlide>
            ))
          : sortedStories.map((story) => (
              <SwiperSlide key={story._id}>
                <div className="stories">
                  <div
                    className="story"
                    onClick={() => handleStoryView(story.userId._id)}
                    style={{
                      background: `url('${story.image}') no-repeat center center/cover`,
                    }}
                  >
                    <div className="profile-pic">
                      <img
                        src={story.userId.profilePicture}
                        alt={story.userId.username}
                      />
                    </div>
                    <p className="name">
                      {story.userId._id === currentUserId
                        ? "Your Story"
                        : story.userId.username}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default Stories;
