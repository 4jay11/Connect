import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import "./EmptyChat.css";

const EmptyChat = ({ handlePlusIconClick, userId, user }) => {
  // Create a wrapper function to ensure the click event is properly handled
  const handlePlusClick = (e) => {
    // Prevent any default behavior or event bubbling
    e.preventDefault();
    e.stopPropagation();

    console.log("EmptyChat plus icon clicked");

    // Call the parent component's handler with a slight delay to ensure it works
    setTimeout(() => {
      if (typeof handlePlusIconClick === "function") {
        handlePlusIconClick();
      } else {
        console.error("handlePlusIconClick is not a function");
      }
    }, 50);
  };

  return (
    <div className="empty-chat">
      <div className="empty-chat-container">
        <FaPlusCircle
          className="plus-icon"
          onClick={handlePlusClick}
          style={{ cursor: "pointer" }}
        />
        <h3>No chat selected</h3>
        <p>Select a conversation or start a new one</p>
      </div>
    </div>
  );
};

export default EmptyChat;
