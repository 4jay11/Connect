import React, { useState } from "react";

const ChatInput = ({
  sendMessage,
  typingTimeoutRef,
  activeFriend,
  user,
  socketRef,
}) => {
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socketRef.current?.emit("typing", {
        userId: user._id,
        targetUserId: activeFriend._id,
      });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1000);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage, activeFriend, user, socketRef);
    setNewMessage("");
    setTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  }
  return (
    <div className="chat-input-area">
      <input
        value={newMessage}
        onChange={handleTyping}
        onKeyDown={handleKeyDown}
        className="chat-input"
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage} className="chat-send-btn">
        Send
      </button>
    </div>
  );
};

export default ChatInput;
