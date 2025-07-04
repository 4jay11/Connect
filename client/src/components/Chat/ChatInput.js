import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";
import "./ChatInput.css";

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
  const [isMobile, setIsMobile] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

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
    const emoji = emojiObject.emoji;
    const cursor = inputRef.current.selectionStart;
    const text = newMessage.slice(0, cursor) + emoji + newMessage.slice(cursor);
    setNewMessage(text);

    // Focus back on input after selecting emoji (for mobile especially)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursorPos = cursor + emoji.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    // For mobile, add touchstart event to handle taps
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
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
          <div
            className={`emoji-picker-container ${isMobile ? "mobile" : ""}`}
            ref={emojiPickerRef}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={isMobile ? 280 : 320}
              height={isMobile ? 340 : 400}
            />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
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
