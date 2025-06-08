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
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownVisible((prev) => !prev);
  };

  const handleSelect = () => {
    onSelectToggle(id, side);
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleWindowClick = () => setDropdownVisible(false);
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div className={`msg-container ${side}`}>
      {side === "msg-left" && (
        <>
          <input
            type="checkbox"
            className="selector-checkbox"
            style={{ display: checkboxVisible ? "inline-block" : "none" }}
            checked={isSelected}
            onChange={() => onSelectToggle(id, side)}
          />
          <div className={`msg ${isSelected ? "selected" : ""}`} id={id}>
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
        </>
      )}

      {side === "msg-right" && (
        <>
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
          <div className={`msg ${isSelected ? "selected" : ""}`} id={id}>
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
            style={{ display: checkboxVisible ? "inline-block" : "none" }}
            checked={isSelected}
            onChange={() => onSelectToggle(id, side)}
          />
        </>
      )}
    </div>
  );
};

export default Message;
