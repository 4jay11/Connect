import React, { useRef, useEffect } from "react";
import Message from "./Message";
import "./ChatMessages.css";

const ChatMessages = ({
  messages,
  user,
  selectedLeft,
  selectedRight,
  checkboxVisible,
  handleSelectToggle,
  isFriendTyping,
  activeFriend,
  showSelectMode,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Helper: Format the date to "Today", "Yesterday" or actual date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // 🔹 Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.timestamp || msg.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="chat-messages">
      <div className="messages-wrapper">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <React.Fragment key={date}>
            <div className="date-separator">
              <span>{date}</span>
            </div>
            {msgs.map((msg) => (
              <Message
                key={msg.id || msg._id}
                id={msg.id || msg._id}
                side={msg.side}
                text={msg.text}
                msgusername={msg.username || msg.senderId?.username}
                username={user.username}
                timestamp={msg.timestamp || msg.createdAt}
                isSelected={
                  msg.side === "msg-left"
                    ? selectedLeft.includes(msg.id || msg._id)
                    : selectedRight.includes(msg.id || msg._id)
                }
                checkboxVisible={checkboxVisible || showSelectMode}
                onSelectToggle={handleSelectToggle}
                showSelectMode={showSelectMode}
              />
            ))}
          </React.Fragment>
        ))}
        {isFriendTyping && (
          <div className="typing-indicator">
            {activeFriend?.username} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
