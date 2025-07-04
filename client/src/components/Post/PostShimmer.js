import React from "react";
import "./PostShimmer.css";

const PostShimmer = () => {
  return (
    <div className="post-shimmer">
      <div className="post-shimmer-header">
        <div className="post-shimmer-profile-photo"></div>
        <div className="post-shimmer-user-info">
          <div className="post-shimmer-username"></div>
          <div className="post-shimmer-meta"></div>
        </div>
      </div>
      <div className="post-shimmer-image"></div>
      <div className="post-shimmer-actions"></div>
      <div className="post-shimmer-caption"></div>
      <div className="post-shimmer-comments"></div>
    </div>
  );
};

export default PostShimmer;
