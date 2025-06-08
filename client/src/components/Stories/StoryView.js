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
import UserCard from "./UserCard";

export default function StoryView() {
  const user = useSelector((state) => state.auth.user);
  const [stories, setStories] = useState([]);
  const [groupedPosts, setGroupedPosts] = useState({});
  const [sortedUserIds, setSortedUserIds] = useState([]);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleStoryLike = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/story/like/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const groupPostsByUserId = (posts) => {
    return posts.reduce((acc, post) => {
      const userId = post.userId._id;
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(post);
      return acc;
    }, {});
  };

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/story/getStories", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setStories(res.data);
    } catch (err) {
      console.error("Error fetching Stories: " + err.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      const grouped = groupPostsByUserId(stories);
      setGroupedPosts(grouped);

      // Sort user IDs: current user first, then by most recent story
      const userIds = Object.keys(grouped);

      const sortedIds = userIds.sort((a, b) => {
        // If a is current user, it comes first
        if (a === user._id) return -1;
        // If b is current user, it comes first
        if (b === user._id) return 1;

        // Get the most recent story for each user
        const userALatestStory = grouped[a].reduce((latest, story) => {
          return !latest ||
            new Date(story.createdAt) > new Date(latest.createdAt)
            ? story
            : latest;
        }, null);

        const userBLatestStory = grouped[b].reduce((latest, story) => {
          return !latest ||
            new Date(story.createdAt) > new Date(latest.createdAt)
            ? story
            : latest;
        }, null);

        // Sort by most recent story
        return (
          new Date(userBLatestStory.createdAt) -
          new Date(userALatestStory.createdAt)
        );
      });

      setSortedUserIds(sortedIds);
    }
  }, [stories, user._id]);

  useEffect(() => {
    if (swiperRef.current && id && sortedUserIds.length > 0) {
      const index = sortedUserIds.indexOf(id);
      if (index !== -1) {
        swiperRef.current.slideTo(index, 0);
      }
    }
  }, [groupedPosts, id, sortedUserIds]);

  // Handle when a user's stories are all deleted
  const handleUserStoriesEmpty = (userId) => {
    // Remove the user from sortedUserIds
    const updatedUserIds = sortedUserIds.filter((id) => id !== userId);
    setSortedUserIds(updatedUserIds);

    // Remove the user from groupedPosts
    const updatedGroupedPosts = { ...groupedPosts };
    delete updatedGroupedPosts[userId];
    setGroupedPosts(updatedGroupedPosts);

    // If there are no more stories, go back to feed
    if (updatedUserIds.length === 0) {
      navigate("/feed");
      return;
    }

    // If the deleted user's stories were being viewed, navigate to another user's stories
    if (userId === id) {
      const currentIndex = sortedUserIds.indexOf(userId);
      let nextIndex;

      if (currentIndex === sortedUserIds.length - 1) {
        // If it was the last user, go to the previous one
        nextIndex = Math.max(0, currentIndex - 1);
      } else {
        // Otherwise go to the next one
        nextIndex = currentIndex;
      }

      const nextUserId = updatedUserIds[nextIndex];
      if (nextUserId) {
        navigate(`/storyView/${nextUserId}`, { replace: true });
      }
    }
  };

  // If no stories at all, show loading or navigate back
  if (stories.length > 0 && sortedUserIds.length === 0) {
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
        <p>No stories available</p>
        <button
          onClick={() => navigate("/feed")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0095f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Feed
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
        onClick={() => navigate("/feed")}
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
          const initialIndex = sortedUserIds.indexOf(id);
          if (initialIndex !== -1) swiper.slideTo(initialIndex, 0);
        }}
        onSlideChange={(swiper) => {
          const newUserId = sortedUserIds[swiper.activeIndex];
          if (newUserId) {
            navigate(`/storyView/${newUserId}`);
          }
        }}
      >
        {sortedUserIds.map((userId) => (
          <SwiperSlide key={userId}>
            <UserCard
              userId={userId}
              stories={groupedPosts[userId]}
              currentUser={user}
              navigate={navigate}
              handleStoryLike={handleStoryLike}
              onUserStoriesEmpty={handleUserStoriesEmpty}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
