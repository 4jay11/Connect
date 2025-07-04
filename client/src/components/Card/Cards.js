import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Cards.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const Cards = ({ data, route, cardType }) => {
  const [cardList, setCardList] = useState({});
  const [userIds, setUserIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();
  const { id, userId } = useParams();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group stories by userId or highlightId
  useEffect(() => {
    if (data && data.length) {
      const grouped = data.reduce((acc, story) => {
        let id;
        if (cardType === "highlight") {
          id = story.highlightId;
        } else {
          id = story.userId._id;
        }
        if (!acc[id]) acc[id] = [];
        acc[id].push(story);
        return acc;
      }, {});
      const ids = Object.keys(grouped);

      setCardList(grouped);
      console.log("grouped", grouped);
      setUserIds(ids);

      // If id exists in URL, set index
      if (id) {
        const index = ids.indexOf(id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }
  }, [data, id]);

  // Navigation
  const goToIndex = (index) => {
    if (index >= 0 && index < userIds.length) {
      setCurrentIndex(index);
      const targetId = userIds[index];
      if (cardType === "highlight") {
        navigate(`/highlights/${userId}/${targetId}`);
      } else {
        navigate(`/${route}/${targetId}`);
      }
    }
  };

  const handlePrev = () => goToIndex(currentIndex - 1);
  const handleNext = () => goToIndex(currentIndex + 1);

  const handleCardComplete = () => {
    console.log(
      "Card complete, current index:",
      currentIndex,
      "total:",
      userIds.length
    );
    if (currentIndex < userIds.length - 1) {
      // Move to the next highlight group
      handleNext();
    } else {
      // End of all highlights, navigate back to profile
      if (cardType === "highlight") {
        navigate(`/profile/${userId}`);
      } else {
        navigate("/");
      }
    }
  };

  // Swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) handleNext(); // swipe left
    if (touchStart - touchEnd < -100) handlePrev(); // swipe right
  };

  const currentUserId = userIds[currentIndex];
  const currentUserCards = cardList[currentUserId] || [];

  return (
    <div className="cards-wrapper">
      {!isMobile && (
        <button
          className="cards-arrow left"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <FiChevronLeft className="navigation" />
        </button>
      )}

      <div
        className="cards-slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="cards-track" style={{ transform: `translateX(0%)` }}>
          <div className="cards-slide">
            {currentUserCards.length > 0 ? (
              <Card
                data={currentUserCards}
                onCardComplete={handleCardComplete}
                setActiveStoryId={() => {}}
                cardType={cardType === "highlight" ? "highlight" : "story"}
                key={currentUserId} // Add key to force re-render when changing highlights
              />
            ) : (
              <div className="empty-card">
                <p>No stories available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isMobile && (
        <button
          className="cards-arrow right"
          onClick={handleNext}
          disabled={currentIndex === userIds.length - 1}
          style={{ opacity: currentIndex === userIds.length - 1 ? 0.5 : 1 }}
        >
          <FiChevronRight className="navigation" />
        </button>
      )}
    </div>
  );
};

export default Cards;
