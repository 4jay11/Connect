import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUsers, FaUserFriends } from "react-icons/fa";

const ChatHeader = ({
  activeFriend,
  checkboxVisible,
  handledelete,
  showMenu,
  setShowMenu,
  handleClearChat,
}) => {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const dropdownRef = useRef(null);

  const handleBack = () => {
    navigate("/chat");
  };

  const handleProfileClick = () => {
    setShowUserInfo(!showUserInfo);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="chat-header" ref={dropdownRef}>
      <div className="header-left">
        <button className="back-button" onClick={handleBack}>
          <IoArrowBack />
        </button>
        <div className="user-profile">
          <div className="header-avatar">
            {activeFriend?.profilePicture ? (
              <img
                src={activeFriend.profilePicture}
                alt={activeFriend.username}
                onClick={handleProfileClick}
              />
            ) : (
              <div className="avatar-placeholder">
                {activeFriend?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <div className="user-name">
              <span>{activeFriend?.username || "Select a friend"}</span>
              <FaCheckCircle className="verified-icon" />
            </div>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>

      {showUserInfo && (
        <div className="user-info-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {activeFriend?.profilePicture ? (
                <img
                  src={activeFriend.profilePicture}
                  alt={activeFriend.username}
                />
              ) : (
                <div className="avatar-placeholder large">
                  {activeFriend?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="dropdown-user-info">
              <h3>{activeFriend?.username}</h3>
              <p>{activeFriend?.bio || "No bio available"}</p>
            </div>
          </div>
          <div className="dropdown-stats">
            <div className="stat-item">
              <FaUser className="stat-icon" />
              <span>Profile</span>
            </div>
            <div className="stat-item">
              <FaUsers className="stat-icon" />
              <span>{activeFriend?.followers?.length || 0} Followers</span>
            </div>
            <div className="stat-item">
              <FaUserFriends className="stat-icon" />
              <span>{activeFriend?.following?.length || 0} Following</span>
            </div>
          </div>
        </div>
      )}

      <div className="header-right">
        {checkboxVisible && (
          <button
            onClick={() => handledelete(activeFriend._id)}
            className="delete-button"
          >
            Delete
          </button>
        )}

        <BsThreeDotsVertical
          onClick={() => setShowMenu((prev) => !prev)}
          className="menu-icon"
        />

        {showMenu && (
          <div className="menu-dropdown">
            <div onClick={handleClearChat} className="menu-item">
              Clear Chat
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
