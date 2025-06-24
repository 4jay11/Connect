import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  sendMessage,
  typingTimeoutRef,
  activeFriend,
  user,
  socketRef,
}) => {
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

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
    if (newMessage.trim()) {
      sendMessage(newMessage, activeFriend, user, socketRef);
      setNewMessage("");
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMsg) => prevMsg + emojiObject.emoji);
  };

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="chat-input-area">
      <div className="emoji-button-container">
        <button
          onClick={toggleEmojiPicker}
          className="emoji-button"
          type="button"
        >
          <FaSmile />
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker-container" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <input
        value={newMessage}
        onChange={handleTyping}
        onKeyDown={handleKeyDown}
        className="chat-input"
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage} className="chat-send-btn">
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default ChatInput;
