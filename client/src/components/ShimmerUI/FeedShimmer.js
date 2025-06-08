// components/FeedShimmer.js
import React from "react";
import "./FeedShimmer.css";

const FeedShimmer = () => {
  return (
    <div className="feed shimmer">
      <div className="head">
        <div className="user">
          <div className="profile-pic shimmer-circle"></div>
          <div className="info">
            <div className="shimmer-line short"></div>
            <div className="shimmer-line thinner"></div>
          </div>
        </div>
      </div>
      <div className="photo shimmer-box"></div>
      <div className="caption shimmer-line"></div>
      <div className="caption shimmer-line short"></div>
    </div>
  );
};

export default FeedShimmer;
