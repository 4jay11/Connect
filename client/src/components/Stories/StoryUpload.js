import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StoryUpload = () => {
  const navigate = useNavigate();

  const handleStoryUpload = () => {
    navigate("/story-upload");
  };

  return (
    <div className="stories">
      <div
        className="story story-upload"
        onClick={handleStoryUpload}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#333",
          cursor: "pointer",
        }}
      >
        <div
          className="add-story-btn"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#0095f6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <FaPlus color="white" size={16} />
        </div>
        <p style={{ fontSize: "12px", color: "white", margin: 0 }}>Add Story</p>
      </div>
    </div>
  );
};

export default StoryUpload;
