import React from "react";

const ChatInput = ({ newMessage, handleTyping, sendMessage }) => (
  <div className="chat-input-area">
    <input
      value={newMessage}
      onChange={handleTyping}
      className="chat-input"
      placeholder="Type your message..."
    />
    <button onClick={sendMessage} className="chat-send-btn">
      Send
    </button>
  </div>
);

export default ChatInput;
