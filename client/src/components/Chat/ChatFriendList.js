import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaChevronDown, FaTrash, FaSignOutAlt } from "react-icons/fa";
import "./ChatFriendList.css";

const ChatFriendsList = ({
  filteredFriends,
  targetUserId,
  setActiveFriend,
  setMessages,
  setSelectedLeft,
  setSelectedRight,
  setCheckboxVisible,
  setSearchQuery,
  handlePlusIconClick,
  handleClearChat,
  handleDeleteChat,
  setShowEmptyChat,
}) => {
  const navigate = useNavigate();
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const handleBackToFeed = () => {
    navigate("/feed");
  };

  const handleClearChatClick = (e, friend) => {
    e.stopPropagation();
    setActiveFriend(friend);
    handleClearChat();
    setActiveDropdownId(null);
  };

  const handleDeleteChatClick = (e, friendId) => {
    e.stopPropagation();
    handleDeleteChat(friendId);
    setShowEmptyChat(true);
    setActiveDropdownId(null);
  };

  const toggleDropdown = (e, friendId) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === friendId ? null : friendId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <button className="back-to-feed" onClick={handleBackToFeed}>
          <IoArrowBack />
          <span>Back to Feed</span>
        </button>
        <button
          className="new-chat-btn"
          onClick={handlePlusIconClick}
          title="Start new conversation"
        >
          <FaPlus />
        </button>
      </div>
      <input
        type="text"
        placeholder="Search friends..."
        className="chat-search"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="friends-list" ref={dropdownRef}>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend._id}
              className={`friend ${
                targetUserId === friend._id ? "active" : ""
              }`}
              onClick={() => {
                setActiveFriend(friend);
                setMessages([]);
                setSelectedLeft([]);
                setSelectedRight([]);
                setCheckboxVisible(false);
                navigate(`/chat/${friend._id}`);
                setShowEmptyChat(false);
              }}
            >
              <div className="friend-avatar">
                {friend.profilePicture ? (
                  <img src={friend.profilePicture} alt={friend.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="friend-info">
                <span className="friend-name">{friend.username}</span>
                <span className="friend-status">Online</span>
              </div>
              <div
                className="friend-options"
                onClick={(e) => toggleDropdown(e, friend._id)}
              >
                <FaChevronDown
                  className={`friend-chevron ${
                    activeDropdownId === friend._id ? "rotated" : ""
                  }`}
                />
                {activeDropdownId === friend._id && (
                  <div className="friend-dropdown">
                    <div
                      className="friend-dropdown-item"
                      onClick={(e) => handleClearChatClick(e, friend)}
                    >
                      <FaTrash className="dropdown-icon" />
                      <span>Clear Chat</span>
                    </div>
                    <div
                      className="friend-dropdown-item"
                      onClick={(e) => handleDeleteChatClick(e, friend._id)}
                    >
                      <FaSignOutAlt className="dropdown-icon" />
                      <span>Delete Chat</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-chats-message">
            <p>No chats available</p>
            <p className="start-chat-hint">
              Click the + button to start a new conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFriendsList;
