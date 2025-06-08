import React from "react";
import {
  UilHome,
  UilCompass,
  UilBell,
  UilEnvelopeAlt,
  UilBookmarkFull,
} from "@iconscout/react-unicons";

import { useNavigate } from "react-router-dom";
import "./Sidebar.css";


const StickySidebar = () => {
  const navigate = useNavigate();
  const handleBookmark = () => {
    console.log("Bookmark clicked");
    navigate("/bookmark");
  };

  const handleHome = () => {
    console.log("Bookmark clicked");
    navigate("/feed");
  };
  const handleMessage = () => {
    console.log("Message clicked");
    navigate("/chat");
  };

  const handleExplore = () => {
    console.log("Explore clicked");
    navigate("/explore");
  };
  return (
    <div>
      <div className="sidebar">
        <div onClick={handleHome} className="menu-item">
          <span>
            <i>
              <UilHome />
            </i>
          </span>
        </div>
        <div onClick={handleExplore} className="menu-item">
          <span>
            <i>
              <UilCompass />
            </i>
          </span>
        </div>

        <div
          onClick={handleMessage}
          className="menu-item"
          id="messages-notification"
        >
          <span>
            <i>
              <UilEnvelopeAlt />
              <small className="notification-count">6+</small>
            </i>
          </span>
        </div>
        <div onClick={handleBookmark} className="menu-item">
          <span>
            <i>
              <UilBookmarkFull />
            </i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StickySidebar;
