import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import "./EmptyChat.css";

const EmptyChat = ({ handlePlusIconClick, userId, user }) => {
  return (
    <div className="empty-chat">
      <div className="empty-chat-container">
        <FaPlusCircle className="plus-icon" onClick={handlePlusIconClick} />
        <h3>No chat selected</h3>
        <p>Select a conversation or start a new one</p>
      </div>
    </div>
  );
};

export default EmptyChat;
