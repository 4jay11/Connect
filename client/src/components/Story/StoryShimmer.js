import React from "react";
import "./StoryShimmer.css";

const StoryShimmer = () => {
  return (
    <div className="story-card shimmer">
      <div className="story-image shimmer-bg">
        <div className="story-overlay"></div>
        <div className="story-profile shimmer-circle"></div>
        <div className="story-username shimmer-text"></div>
      </div>
    </div>
  );
};

export default StoryShimmer;
