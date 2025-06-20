import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import StickySidebar from "../Sidebar/StickySidebar";
import BookmarkCard from "./BookmarkCard";
import { fetchBookmarks } from "../../utils/fetch";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchBookmarks(setBookmarkedPosts);
  }, []);

  return (
    <div className="book">
      <Navbar />
      <div className="bookmark-page" style={{ marginTop: "80px" }}>
        <div className="left">
          <StickySidebar />
        </div>
        <div className="right">
          <div className="book-title">
            <h1 className="bookmarks">Bookmarks</h1>
          </div>
          <div className="bookmark-container">
            {bookmarkedPosts.length ? (
              bookmarkedPosts.map((post, index) => (
                <BookmarkCard key={post._id} bookmarkPhoto={post.image} />
              ))
            ) : (
              <p>No bookmarks found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;