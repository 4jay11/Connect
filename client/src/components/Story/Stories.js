import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "./Stories.css";
import StoryShimmer from "./StoryShimmer";
import { getStories } from "../../services/storyApi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Stories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setCurrentUserId(user._id);
    }

    fetchStoriesData();
  }, []);

  const fetchStoriesData = async () => {
    try {
      setLoading(true);
      const data = await getStories();
      setStories(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Stories: " + err.message);
      setLoading(false);
    }
  };

  const handleStoryView = (id) => {
    navigate(`/story-page/${id}`);
  };

  // Group stories by user, keeping only the most recent story per user
  const uniqueUserStories = Object.values(
    stories.reduce((acc, story) => {
      const userId = story.userId._id;
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
    if (a.userId._id === currentUserId) return -1;
    if (b.userId._id === currentUserId) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleCreateStory = () => {
    navigate("/story-upload");
  };

  return (
    <div className="stories-container">
      <div className="stories-wrapper">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView="auto"
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            320: { slidesPerView: 3 },
            480: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
          className="stories-swiper"
        >
          {/* Add Story Option */}
          <SwiperSlide>
            <div className="story-card add-story" onClick={handleCreateStory}>
              <div className="add-story-icon">+</div>
              <p className="add-story-text">Add Story</p>
            </div>
          </SwiperSlide>

          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide key={`shimmer-${index}`}>
                  <StoryShimmer />
                </SwiperSlide>
              ))
            : sortedStories.map((story) => (
                <SwiperSlide key={story._id}>
                  <div
                    className="story-card"
                    onClick={() => handleStoryView(story.userId._id)}
                  >
                    <div
                      className="story-image"
                      style={{
                        backgroundImage: `url('${story.image}')`,
                      }}
                    >
                      <div className="story-overlay"></div>
                      <div className="story-profile">
                        <img
                          src={story.userId.profilePicture}
                          alt={story.userId.username}
                        />
                      </div>
                      <div className="story-username">
                        {story.userId._id === currentUserId
                          ? "Your Story"
                          : story.userId.username}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Stories;
