import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import FeedCard from "./FeedCard";
import { formatDistanceToNow, parseISO } from "date-fns";
// import { assets } from "../../../../dummy/images/assets";

export const FeedNavigationButton = ({
  direction = "left",
  onClick,
  children,
}) => {
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

const FeedPopup = ({
  posts,
  currentIndex,
  setCurrentIndex,
  onClose,
  onLike,
  onBookmark,
  onEdit,
  onDelete,
}) => {
  const selectedPost = posts[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  if (!selectedPost) return null;

  const {
    _id: post_id,
    image: feedPhoto,
    content: caption,
    likes: likedBy = [],
    bookmarks: bookmarkBy = [],
    location = "Unknown Location",
    createdAt,
    userId,
  } = selectedPost;

  const username = userId?.username || "Unknown";
  const user_id = userId?._id || "";
  const profilePhoto = userId?.profilePicture || "";
  const timeAgo = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

  return (
    <div className="feed-popup-overlay">
      <div className="feed-popup-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <FeedNavigationButton direction="left" onClick={handlePrev}>
          <FaArrowLeft />
        </FeedNavigationButton>

        <FeedCard
          key={post_id}
          user_id={user_id}
          post_id={post_id}
          profilePhoto={profilePhoto}
          username={username}
          location={location}
          timeAgo={timeAgo}
          feedPhoto={feedPhoto}
          likedBy={likedBy}
          bookmarkBy={bookmarkBy}
          caption={caption}
          onBookmark={onBookmark}
          onLike={onLike}
          handlePostEdit={onEdit}
          handlePostDelete={onDelete}
        />

        <FeedNavigationButton direction="right" onClick={handleNext}>
          <FaArrowRight />
        </FeedNavigationButton>
      </div>
    </div>
  );
};

export default FeedPopup;
