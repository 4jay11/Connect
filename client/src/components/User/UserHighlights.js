import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import "./UserHighlights.css";
import { getHighlights } from "../../services/highlights";
import { useNavigate } from "react-router-dom";

const UserHighlights = ({ userId }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await getHighlights(userId);
        setHighlights(res || []);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, [userId]);

  const handleHighlightClick = (highlightId) => {
    console.log(`Highlight ${highlightId} clicked`);
    navigate(`/highlights/${userId}/${highlightId}`);
    // Launch story viewer here
  };

  const handleAddHighlight = () => {
    console.log("Add highlight clicked");
    // Open modal to add new highlight
  };

  if (loading) {
    return (
      <div className="user-highlights">
        <h3 className="highlights-title">Highlights</h3>
        <div className="highlights-container">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="highlight-item skeleton">
              <div className="highlight-avatar skeleton-avatar"></div>
              <div className="highlight-title skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="user-highlights">
      <h3 className="highlights-title">Highlights</h3>
      <div className="highlights-container">
        <div
          className="highlight-item add-highlight"
          onClick={handleAddHighlight}
        >
          <div className="highlight-avatar add-avatar">
            <FaPlus />
          </div>
          <span className="highlight-title">New</span>
        </div>

        {highlights.map((highlight) => (
          <div
            key={highlight._id}
            className="highlight-item"
            onClick={() => handleHighlightClick(highlight._id)}
          >
            <div className="highlight-avatar">
              <img
                src={highlight.coverImage || "/default-highlight.jpg"}
                alt={highlight.name}
                onError={(e) => (e.target.src = "/default-highlight.jpg")}
              />
            </div>
            <span className="highlight-title">{highlight.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHighlights;
