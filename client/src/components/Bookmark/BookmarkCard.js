import React from "react";
import "./Bookmarks.css";

const BookmarkCard = ({ bookmarkPhoto }) => {
  return (
    <div className="book-list">
      <div className="photo">
        <img src={bookmarkPhoto} alt="Bookmark" />
      </div>
    </div>
  );
};

export default BookmarkCard;
