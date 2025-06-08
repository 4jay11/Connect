import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import axios from "axios";
import { useSelector } from "react-redux";
import UserCard from "../Stories/UserCard";

export default function HighlightView() {
  const user = useSelector((state) => state.auth.user);
  const [highlights, setHighlights] = useState([]);
  const [highlightUser, setHighlightUser] = useState(null);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const { userId, highlightId, storyId } = useParams();

  const handleStoryLike = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/story/like/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchHighlights = async () => {
    try {
      // First fetch the user data
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${userId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setHighlightUser(userResponse.data.user);

      // Then fetch the highlights data
      const highlightsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/highlight/user/${userId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setHighlights(highlightsResponse.data);
    } catch (err) {
      console.error("Error fetching highlights:", err.message);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [userId]);

  useEffect(() => {
    if (swiperRef.current && storyId && highlights.length > 0) {
      // Find the highlight that contains the story
      const highlightWithStory = highlights.find((highlight) =>
        highlight.stories.some((story) => story._id === storyId)
      );

      if (highlightWithStory) {
        const index = highlights.findIndex(
          (h) => h._id === highlightWithStory._id
        );
        if (index !== -1) {
          swiperRef.current.slideTo(index, 0);
        }
      }
    }
  }, [highlights, storyId]);

  // Handle when a story is deleted
  const handleStoryDeleted = (storyId) => {
    setHighlights((prevHighlights) =>
      prevHighlights
        .map((highlight) => ({
          ...highlight,
          stories: highlight.stories.filter((story) => story._id !== storyId),
        }))
        .filter((highlight) => highlight.stories.length > 0)
    );

    // If no highlights left, go back to profile
    if (highlights.length === 1) {
      navigate(`/profile/${userId}`);
    }
  };

  if (!highlights.length || !highlightUser) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          color: "white",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p>No highlights available</p>
        <button
          onClick={() => navigate(`/profile/${userId}`)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0095f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div
      className="story-view-container"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        onClick={() => navigate(`/profile/${userId}`)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "35px",
          height: "35px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        ×
      </button>

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "8px 16px",
          borderRadius: "20px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={highlightUser.profilePicture}
          alt={highlightUser.username}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />
        <span>{highlightUser.username}</span>
        <span style={{ margin: "0 5px" }}>•</span>
        <span>Highlights</span>
      </div>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={false}
        slidesPerView={3}
        watchSlidesProgress={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        navigation
        modules={[EffectCoverflow, Navigation]}
        className="outer-swiper"
        style={{ width: "80%", height: "90%" }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (highlightId) {
            const index = highlights.findIndex((h) => h._id === highlightId);
            if (index !== -1) swiper.slideTo(index, 0);
          }
        }}
        onSlideChange={(swiper) => {
          const currentHighlight = highlights[swiper.activeIndex];
          if (currentHighlight) {
            navigate(`/highlights/${userId}/${currentHighlight._id}`);
          }
        }}
      >
        {highlights.map((highlight) => (
          <SwiperSlide key={highlight._id}>
            <UserCard
              userId={userId}
              stories={highlight.stories.map((story) => ({
                ...story,
                userId: highlightUser, // Add user data to each story
              }))}
              currentUser={user}
              navigate={navigate}
              handleStoryLike={handleStoryLike}
              onUserStoriesEmpty={handleStoryDeleted}
              isHighlight={true}
              highlightId={highlight._id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
