import React, { useEffect, useState } from "react";
import "./Messages.css";

const Message = ({
  id,
  side,
  text,
  onSelectToggle,
  isSelected,
  checkboxVisible,
  timestamp,
  username,
  msgusername,
  showSelectMode,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = (e) => {
    if (showSelectMode) return;
    e.stopPropagation();
    setDropdownVisible((prev) => !prev);
  };

  const handleSelect = () => {
    onSelectToggle(id, side);
    setDropdownVisible(false);
  };

  const handleMessageClick = () => {
    if (showSelectMode) {
      onSelectToggle(id, side);
    }
  };

  // Close dropdown when entering select mode
  useEffect(() => {
    if (showSelectMode) {
      setDropdownVisible(false);
    }
  }, [showSelectMode]);

  useEffect(() => {
    const handleWindowClick = () => setDropdownVisible(false);
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div
      className={`msg-container ${side} ${showSelectMode ? "select-mode" : ""}`}
    >
      {side === "msg-left" && (
        <>
          <input
            type="checkbox"
            className="selector-checkbox"
            style={{
              display:
                checkboxVisible || showSelectMode ? "inline-block" : "none",
            }}
            checked={isSelected}
            onChange={() => onSelectToggle(id, side)}
          />
          <div
            className={`msg ${isSelected ? "selected" : ""} ${
              showSelectMode ? "selectable" : ""
            }`}
            id={id}
            onClick={handleMessageClick}
          >
            {msgusername !== username && (
              <div className="sender-name">{msgusername}</div>
            )}
            <p>{text}</p>
            <div className="timestamp">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {!showSelectMode && (
            <div className="dots-dropdown-wrapper">
              <div className="three-dots-wrapper" onClick={toggleDropdown}>
                <div className="three-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              {dropdownVisible && (
                <div className="dropdown">
                  <button onClick={handleSelect}>Select</button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {side === "msg-right" && (
        <>
          {!showSelectMode && (
            <div className="dots-dropdown-wrapper">
              <div className="three-dots-wrapper" onClick={toggleDropdown}>
                <div className="three-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              {dropdownVisible && (
                <div className="dropdown">
                  <button onClick={handleSelect}>Select</button>
                </div>
              )}
            </div>
          )}
          <div
            className={`msg ${isSelected ? "selected" : ""} ${
              showSelectMode ? "selectable" : ""
            }`}
            id={id}
            onClick={handleMessageClick}
          >
            <p>{text}</p>
            <div className="timestamp">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <input
            type="checkbox"
            className="selector-checkbox"
            style={{
              display:
                checkboxVisible || showSelectMode ? "inline-block" : "none",
            }}
            checked={isSelected}
            onChange={() => onSelectToggle(id, side)}
          />
        </>
      )}
    </div>
  );
};

export default Message;
