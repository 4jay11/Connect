import React, { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import StoryCard from "./StoryCard";

export default function UserCard({
  userId,
  stories,
  currentUser,
  navigate,
  handleStoryLike,
  onUserStoriesEmpty,
  isHighlight = false,
  highlightId = null,
}) {
  // Keep local state of stories to handle deletions
  const [localStories, setLocalStories] = useState(stories);

  // Update local stories when props change
  useEffect(() => {
    setLocalStories(stories);
  }, [stories]);

  // Sort stories by creation time (newest first)
  const sortedStories = useMemo(() => {
    return [...localStories].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [localStories]);

  // Handle story deletion
  const handleDeleteStory = (storyId) => {
    // Update local state by removing the deleted story
    const updatedStories = localStories.filter(
      (story) => story._id !== storyId
    );
    setLocalStories(updatedStories);

    // If this was the last story for this user, notify parent component
    if (updatedStories.length === 0 && onUserStoriesEmpty) {
      onUserStoriesEmpty(userId);
    }
  };

  // If no stories left, don't render anything
  if (localStories.length === 0) {
    return null;
  }

  return (
    <div
      onClick={() => {
        if (isHighlight) {
          navigate(`/highlights/${userId}/${highlightId}`);
        } else {
          navigate(`/storyView/${userId}`);
        }
      }}
      className="story-card"
      style={{
        borderRadius: "32px",
        overflow: "hidden",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
        cursor: "pointer",
      }}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={sortedStories.length > 1}
        navigation
        watchSlidesProgress={true}
        modules={[Navigation]}
        style={{ width: "100%", height: "100%" }}
        onSlideChange={(swiper) => {
          if (isHighlight && highlightId) {
            const currentStory = sortedStories[swiper.activeIndex];
            if (currentStory) {
              navigate(
                `/highlights/${userId}/${highlightId}/${currentStory._id}`
              );
            }
          }
        }}
      >
        {sortedStories.map((story) => (
          <SwiperSlide key={story._id}>
            <StoryCard
              story={story}
              storyId={story._id}
              currentUser={currentUser}
              userId={userId}
              handleStoryLike={handleStoryLike}
              onDeleteStory={handleDeleteStory}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
