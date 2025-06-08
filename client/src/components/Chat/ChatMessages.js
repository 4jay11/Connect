import React, { useRef, useEffect } from "react";
import Message from "./Message";

const ChatMessages = ({
  messages,
  user,
  selectedLeft,
  selectedRight,
  checkboxVisible,
  handleSelectToggle,
  isFriendTyping,
  activeFriend,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-messages">
      <div className="messages-wrapper">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            id={msg.id}
            side={msg.side}
            text={msg.text}
            msgusername={msg.username}
            username={user.username}
            timestamp={msg.timestamp}
            isSelected={
              msg.side === "msg-left"
                ? selectedLeft.includes(msg.id)
                : selectedRight.includes(msg.id)
            }
            checkboxVisible={checkboxVisible}
            onSelectToggle={handleSelectToggle}
          />
        ))}
        {isFriendTyping && (
          <div className="typing-indicator">
            {activeFriend?.username} is typing...
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
