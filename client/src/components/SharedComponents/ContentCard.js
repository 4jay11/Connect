import React from "react";
import PropTypes from "prop-types";
import "./ContentGrid.css";

const ContentCard = ({ post, onClick }) => {
  return (
    <div className="content-item" onClick={onClick}>
      <img
        src={post.image}
        alt={`Post by ${post.userId?.username || "user"}`}
      />
      <div className="content-item-overlay">
        <div className="content-item-info">
          <span>❤️ {post.likes?.length || 0}</span>
          <span>💬 {post.comments?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

ContentCard.propTypes = {
  post: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ContentCard;
