import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "./Chat.css";

const ChatFriendsList = ({
  filteredFriends,
  targetUserId,
  setActiveFriend,
  setMessages,
  setSelectedLeft,
  setSelectedRight,
  setCheckboxVisible,
  setSearchQuery,
}) => {
  const navigate = useNavigate();

  const handleBackToFeed = () => {
    navigate("/feed");
  };
  console.log(filteredFriends);
  
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <button className="back-to-feed" onClick={handleBackToFeed}>
          <IoArrowBack />
          <span>Back to Feed</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Search friends..."
        className="chat-search"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="friends-list">
        {filteredFriends.map((friend) => (
          <div
            key={friend._id}
            className={`friend ${targetUserId === friend._id ? "active" : ""}`}
            onClick={() => {
              setActiveFriend(friend);
              setMessages([]);
              setSelectedLeft([]);
              setSelectedRight([]);
              setCheckboxVisible(false);
              navigate(`/chat/${friend._id}`);
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatFriendsList;
