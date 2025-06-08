import React from "react";
import StickySidebar from "../Sidebar/StickySidebar";

const ChatSidebar = () => (
  <div
    className="-sidebar"
    style={{
      display: "flex",
      flexDirection: "column",
      backgroundColor: "hsl(252, 30%, 95%)",
      padding: "1rem 0.5rem",
      width: "100px",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 10,
    }}
  >
    <div className="bookmark">
      <div className="left">
        <StickySidebar />
      </div>
    </div>
  </div>
);

export default ChatSidebar;
