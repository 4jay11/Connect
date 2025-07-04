import React, { useEffect, useState, useRef } from "react";
import "./Card.css";
import { CardItem } from "./CardItem";
import { useNavigate, useParams } from "react-router-dom";
import { FiPause, FiPlay } from "react-icons/fi";

const Card = ({ data, onCardComplete, cardType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const intervalRef = useRef(null);
  const progressResetRef = useRef(false);

  const navigate = useNavigate();
  const { storyIndex } = useParams();

  useEffect(() => {
    if (data && data.length) {
      setCards(data);
      const index = storyIndex ? parseInt(storyIndex) : 0;
      setCurrentIndex(
        !isNaN(index) && index >= 0 && index < data.length ? index : 0
      );
      // Reset progress when data changes
      setProgress(0);
      progressResetRef.current = true;
    }
  }, [data, storyIndex]);

  useEffect(() => {
    // Reset progress when changing cards
    setProgress(0);
    progressResetRef.current = true;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start progress if not paused
    if (!isPaused && !dropdownOpen) {
      startProgress();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  // Effect to handle pause/resume and dropdown state
  useEffect(() => {
    if (isPaused || dropdownOpen) {
      // Pause: clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      // Resume: start progress from current position
      startProgress();
    }
  }, [isPaused, dropdownOpen]);

  const startProgress = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset progress if needed
    if (progressResetRef.current) {
      setProgress(0);
      progressResetRef.current = false;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);
          handleNext();
          return 0;
        }
        return newProgress;
      });
    }, 150);
  };

  const handleNext = () => {
    // Reset progress flag
    progressResetRef.current = true;

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (onCardComplete) {
      // When we reach the end of current highlight stories, call onCardComplete
      // to navigate to the next highlight
      onCardComplete();
    }
  };

  const handlePrev = () => {
    // Reset progress flag
    progressResetRef.current = true;

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const togglePause = (e) => {
    e.stopPropagation();
    setIsPaused(!isPaused);
  };

  // Handler for dropdown state changes
  const handleDropdownChange = (isOpen) => {
    setDropdownOpen(isOpen);
  };

  return (
    <div className="wrapper">
      <div className="card-container">
        <div className="multi-progress-wrapper">
          {cards.map((_, index) => (
            <div
              className={`multi-progress-bar ${
                index < currentIndex
                  ? "filled"
                  : index === currentIndex
                  ? "active"
                  : ""
              }`}
              key={index}
            >
              {index === currentIndex && (
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: "white",
                    transition:
                      isPaused || dropdownOpen ? "none" : "width 0.15s linear",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Pause/Play button with inline CSS - positioned before the card content */}
        <div
          onClick={togglePause}
          style={{
            position: "absolute",
            top: "18px",
            right: "100px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            zIndex: 15,
            color: "white",
            fontSize: "20px",
          }}
        >
          {isPaused ? <FiPlay /> : <FiPause />}
        </div>

        {cards[currentIndex] && (
          <div
            className="card-slide"
            onMouseDown={handlePause}
            onMouseUp={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
          >
            <CardItem
              post={cards[currentIndex]}
              onStoryEnd={handleNext}
              cardType={cardType}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              onDropdownChange={handleDropdownChange}
            />
          </div>
        )}

        <div className="click-zone-card left" onClick={handlePrev}></div>
        <div className="click-zone-card right" onClick={handleNext}></div>
      </div>
    </div>
  );
};

export default Card;
