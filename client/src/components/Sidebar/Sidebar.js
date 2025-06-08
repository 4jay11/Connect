import React from "react";
import {
  UilHome,
  UilCompass,
  UilBell,
  UilEnvelopeAlt,
  UilBookmarkFull,
} from "@iconscout/react-unicons";
// import { assets } from "../../../../dummy/images/assets";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useSelector } from "react-redux";

const Sidebar = () => {

  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleBookmark = () => {
    console.log("Bookmark clicked");
    navigate("/bookmark");
  };
  const handleMessage = () => {
    console.log("Message clicked");
    navigate("/chat");
  };

  const handleExplore = () => {
    console.log("Explore clicked");
    navigate("/explore");
  }
  return (
    <div>
      <div className="profile" href="#">
        <div className="profile-photo">
          <img src={currentUser.profilePicture} alt="Profile" />
        </div>
        <div className="handle">
          <h4>{currentUser.username}</h4>
          <p className="text-muted">{currentUser.username} </p>
        </div>
      </div>

      <div className="sidebar">
        <div className="menu-item active">
          <span>
            <i>
              <UilHome />
            </i>
          </span>
          <h3>Home</h3>
        </div>
        <div onClick={handleExplore} className="menu-item">
          <span>
            <i>
              <UilCompass />
            </i>
          </span>
          <h3>Explore</h3>
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
          <h3>Messages</h3>
        </div>
        <div onClick={handleBookmark} className="menu-item">
          <span>
            <i>
              <UilBookmarkFull />
            </i>
          </span>
          <h3>Bookmarks</h3>
        </div>
        {/* Add more menu items */}
      </div>
    </div>
  );
};

export default Sidebar;
