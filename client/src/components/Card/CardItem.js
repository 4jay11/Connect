// CardItem.js
import React, { useState, useEffect, useRef } from "react";
import "./CardItem.css";
import {
  FiHeart,
  FiMoreHorizontal,
  FiChevronDown,
  FiX,
  FiTrash2,
  FiStar,
  FiPlus,
  FiFolder,
} from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  deleteStory,
  likeStory,
  addStoryToHighlight,
  createHighlight,
  deleteStoryFromHighlight,
  deleteHighlight,
} from "../../services/storyApi";

import { getHighlights } from "../../services/highlights";
import { useSelector } from "react-redux";
export const CardItem = ({
  post,
  onStoryEnd,
  cardType,
  isPaused,
  setIsPaused,
  onDropdownChange,
}) => {
  let { userId, createdAt, image, content, storyId, _id, highlightId } =
    post || {};
  if (cardType == "story") {
    storyId = _id;
  }
  const [showDropdown, setShowDropdown] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [showCreateHighlightModal, setShowCreateHighlightModal] =
    useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const [liked, setLiked] = useState(false);
  const [highlightName, setHighlightName] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  // Notify parent component when dropdown state changes
  useEffect(() => {
    if (onDropdownChange) {
      onDropdownChange(showDropdown);
    }
  }, [showDropdown, onDropdownChange]);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await getHighlights(currentUser._id);
        setHighlights(res);
      } catch (error) {
        console.error("Failed to fetch highlights:", error);
      }
    };
    fetchHighlights();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 3600000);
    return diff < 1 ? "Just now" : `${diff}hr ago`;
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleAddToHighlights = (e) => {
    e.stopPropagation();
    // setShowDropdown(false);
    setShowHighlightModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsLoading(true);

      if (deleteTarget.type === "story") {
        await deleteStory(deleteTarget.id);
        if (onStoryEnd) onStoryEnd();
      } else if (deleteTarget.type === "storyFromHighlight") {
        await deleteStoryFromHighlight(
          deleteTarget.highlightId,
          deleteTarget.storyId
        );
      } else if (deleteTarget.type === "highlight") {
        await deleteHighlight(deleteTarget.highlightId);
      }

      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error during deletion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await likeStory(storyId);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const handleClose = () => navigate("/");

  const handleAddToExistingHighlight = async (highlightId) => {
    try {
      console.log(" story added to highlight");
      console.log(highlightId, storyId);
      setIsLoading(true);
      await addStoryToHighlight(highlightId, storyId);
      setShowHighlightModal(false);
    } catch (error) {
      console.error("Error adding to highlight:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHighlight = async () => {
    if (!highlightName.trim()) return;

    try {
      setIsLoading(true);
      await createHighlight(highlightName, storyId, image);
      setShowCreateHighlightModal(false);
      setHighlightName("");
    } catch (error) {
      console.error("Error creating highlight:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setDeleteTarget({ type: "story", id: storyId });
    setShowDeleteConfirm(true);
  };

  const handleDeleteStoryFromHighlightClick = (e) => {
    e.stopPropagation();
    if (!highlightId || !storyId) return;
    setShowDropdown(false);
    setDeleteTarget({ type: "storyFromHighlight", highlightId, storyId });
    setShowDeleteConfirm(true);
  };

  const handleDeleteHighlightClick = (e) => {
    e.stopPropagation();
    if (!highlightId) return;
    setShowDropdown(false);
    setDeleteTarget({ type: "highlight", highlightId: highlightId });
    setShowDeleteConfirm(true);
  };

  return (
    <div className="card-item">
      <div className="card-header">
        <div className="card-profile">
          <img
            src={userId?.profilePicture || "/default-avatar.png"}
            alt={userId?.username || "User"}
            className="profile-pic"
          />
          <div className="profile-info">
            <div className="profile-name">{userId?.username || "Unknown"}</div>
            <div className="profile-time">{timeAgo(createdAt)}</div>
          </div>
        </div>
        <FiX className="close-icon" onClick={handleClose} />
        {currentUser._id === (cardType == "story" ? userId._id : _id) && (
          <div className="menu-container" ref={dropdownRef}>
            <FiMoreHorizontal className="menu-icon" onClick={handleMenuClick} />
            {cardType === "story" && showDropdown && (
              <div className="dropdown-menu active">
                <div className="dropdown-item" onClick={handleAddToHighlights}>
                  <FiStar /> Add to Highlights
                </div>
                <div
                  className="dropdown-item delete"
                  onClick={handleDeleteClick}
                >
                  <FiTrash2 /> Delete Story
                </div>
              </div>
            )}
            {cardType === "highlight" && showDropdown && (
              <div className="dropdown-menu active">
                <div
                  className="dropdown-item delete"
                  onClick={handleDeleteStoryFromHighlightClick}
                >
                  <FiTrash2 /> Delete Story
                </div>
                <div
                  className="dropdown-item delete"
                  onClick={handleDeleteHighlightClick}
                >
                  <FiTrash2 /> Delete Highlight
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="card-image-container">
        <img
          src={image || "/default-image.png"}
          alt="story"
          className="main-image"
        />
      </div>
      <div className="card-content">
        <div className="card-title">
          <h2 ref={contentRef}>{content}</h2>
          {hasMoreContent && (
            <FiChevronDown
              className="expand-indicator"
              onClick={() => setShowContentModal(true)}
            />
          )}
        </div>
        <div onClick={handleLike}>
          {liked ? (
            <AiFillHeart className="heart-icon liked" />
          ) : (
            <FiHeart className="heart-icon" />
          )}
        </div>
      </div>
      {showContentModal && (
        <div
          className="content-modal active"
          onClick={() => setShowContentModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FiX
              className="modal-close"
              onClick={() => setShowContentModal(false)}
            />
            <div className="modal-text">{content}</div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="confirmation-modal active">
          <div className="confirmation-box">
            <div className="confirmation-title">
              {deleteTarget?.type === "highlight"
                ? "Delete this highlight?"
                : deleteTarget?.type === "storyFromHighlight"
                ? "Remove this story from highlight?"
                : "Delete this story?"}
            </div>

            <div className="confirmation-buttons">
              <button
                className="btn btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-confirm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showHighlightModal && (
        <div className="highlight-modal active">
          <div className="highlight-content">
            <div className="highlight-header">
              <h3>Add to Highlight</h3>
              <FiX
                className="modal-close"
                onClick={() => setShowHighlightModal(false)}
              />
            </div>

            <div className="highlight-list">
              {highlights.length > 0 ? (
                highlights.map((highlight) => (
                  <div
                    key={highlight._id}
                    className="highlight-item"
                    onClick={() => handleAddToExistingHighlight(highlight._id)}
                  >
                    <FiFolder className="highlight-icon" />
                    <span>{highlight.name}</span>
                  </div>
                ))
              ) : (
                <div className="no-highlights">No highlights found</div>
              )}

              <div
                className="highlight-item create"
                onClick={() => {
                  setShowHighlightModal(false);
                  setShowCreateHighlightModal(true);
                }}
              >
                <FiPlus className="highlight-icon" />
                <span>Create New Highlight</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateHighlightModal && (
        <div className="highlight-modal active">
          <div className="highlight-content">
            <div className="highlight-header">
              <h3>Create New Highlight</h3>
              <FiX
                className="modal-close"
                onClick={() => setShowCreateHighlightModal(false)}
              />
            </div>

            <div className="create-highlight-form">
              <input
                type="text"
                placeholder="Highlight name"
                value={highlightName}
                onChange={(e) => setHighlightName(e.target.value)}
                className="highlight-input"
              />

              <div className="confirmation-buttons">
                <button
                  className="btn btn-cancel"
                  onClick={() => setShowCreateHighlightModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-confirm"
                  onClick={handleCreateHighlight}
                  disabled={isLoading || !highlightName.trim()}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
