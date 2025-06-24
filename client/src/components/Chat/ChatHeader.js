import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaUserFriends,
  FaTrash,
  FaCheck,
  FaEllipsisV,
  FaTimes,
  FaCheckDouble,
} from "react-icons/fa";

const ChatHeader = ({
  activeFriend,
  checkboxVisible,
  handleChatdelete,
  showMenu,
  setShowMenu,
  handleClearChat,
  handleSelectMessages,
  handleSelectAll,
  showSelectMode,
  handleExitSelectMode,
}) => {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const menuDropdownRef = useRef(null);

  const handleBack = () => {
    navigate("/chat");
  };

  const handleProfileClick = () => {
    setShowUserInfo(!showUserInfo);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserInfo(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMenu]);

  return (
    <div className="chat-header">
      <div className="header-left" ref={dropdownRef}>
        <button className="back-button" onClick={handleBack}>
          <IoArrowBack />
        </button>
        <div className="user-profile" onClick={handleProfileClick}>
          <div className="header-avatar">
            {activeFriend?.profilePicture ? (
              <img
                src={activeFriend.profilePicture}
                alt={activeFriend.username}
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
      </div>

      <div className="header-right" ref={menuRef}>
        {checkboxVisible && (
          <button onClick={handleChatdelete} className="delete-button">
            Delete
          </button>
        )}

        {showSelectMode && (
          <>
            <div className="select-mode-indicator">
              <FaCheck /> Select Mode
            </div>
            <button
              onClick={handleExitSelectMode}
              className="exit-select-mode-btn"
            >
              <FaTimes />
            </button>
          </>
        )}

        {!showSelectMode && (
          <div className="menu-icon-wrapper" onClick={toggleMenu}>
            <FaEllipsisV className="menu-icon" />
            {showMenu && (
              <div className="menu-dropdown" ref={menuDropdownRef}>
                <div onClick={handleSelectMessages} className="menu-item">
                  <FaCheck className="menu-icon-small" />
                  <span className="menu-text">Select Messages</span>
                </div>
                <div onClick={handleSelectAll} className="menu-item">
                  <FaCheckDouble className="menu-icon-small" />
                  <span className="menu-text">Select All</span>
                </div>
                <div onClick={handleClearChat} className="menu-item">
                  <FaTrash className="menu-icon-small" />
                  <span className="menu-text">Clear Chat</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
