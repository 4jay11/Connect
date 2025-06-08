import React from "react";

const ExploreCard = ({ bookmarkPhoto, onClick }) => {
  return (
    <div className="explore-list" onClick={onClick}>
      <div className="photo">
        <img src={bookmarkPhoto} alt="Bookmark" />
      </div>
    </div>
  );
};

export default ExploreCard;
