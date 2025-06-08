import React, { useEffect, useState, useRef } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaBookmark,
  FaPlus,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import "./StoryCard.css";
export default function StoryCard({
  story,
  storyId,
  currentUser,
  userId,
  handleStoryLike,
  onDeleteStory,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showHighlightOptions, setShowHighlightOptions] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(false);
  const [showCreateHighlight, setShowCreateHighlight] = useState(false);
  const [newHighlightName, setNewHighlightName] = useState("");
  const [isCreatingHighlight, setIsCreatingHighlight] = useState(false);
  const [isAddingToHighlight, setIsAddingToHighlight] = useState(false);
  const [addToHighlightError, setAddToHighlightError] = useState("");
  const dropdownRef = useRef(null);
  const highlightOptionsRef = useRef(null);

  useEffect(() => {
    setIsLiked(story?.likes?.includes(currentUser._id));
  }, [story?.likes, currentUser._id]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        highlightOptionsRef.current &&
        !highlightOptionsRef.current.contains(event.target)
      ) {
        setShowHighlightOptions(false);
        setShowCreateHighlight(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserHighlights = async () => {
    setIsLoadingHighlights(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/highlight/user/${currentUser._id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setHighlights(response.data);
    } catch (error) {
      console.error("Error fetching highlights:", error);
    } finally {
      setIsLoadingHighlights(false);
    }
  };

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
    setShowHighlightOptions(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);

    try {
      await axios.delete(
        `http://localhost:8000/story/deleteStory/${story._id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Call the parent component's onDeleteStory function to update UI
      if (onDeleteStory) {
        onDeleteStory(story._id);
      }

      setShowConfirmation(false);
    } catch (error) {
      console.error("Error deleting story:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowConfirmation(false);
  };

  const handleHighlightClick = async (e) => {
    e.stopPropagation();
    setShowDropdown(false);

    // Fetch user's highlights
    await fetchUserHighlights();

    setShowHighlightOptions(true);
  };

  const handleAddToHighlight = async (highlightId) => {
    setIsAddingToHighlight(true);
    setAddToHighlightError("");

    try {
      await axios.patch(
        "http://localhost:8000/highlight/add-story",
        {
          highlightId,
          storyId: story._id,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Success message or UI update
      setShowHighlightOptions(false);
    } catch (error) {
      console.error("Error adding to highlight:", error);
      setAddToHighlightError(
        error.response?.data?.message || "Failed to add to highlight"
      );
    } finally {
      setIsAddingToHighlight(false);
    }
  };

  const handleCreateHighlightClick = (e) => {
    e.stopPropagation();
    setShowCreateHighlight(true);
  };

  const handleCreateHighlight = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newHighlightName.trim()) {
      return;
    }

    setIsCreatingHighlight(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/highlight/create",
        {
          name: newHighlightName,
          storyId: story._id,
          coverImage: story.image,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Add the new highlight to the list
      setHighlights([...highlights, response.data.highlight]);

      // Reset form and close
      setNewHighlightName("");
      setShowCreateHighlight(false);
      setShowHighlightOptions(false);
    } catch (error) {
      console.error("Error creating highlight:", error);
      setAddToHighlightError(
        error.response?.data?.message || "Failed to create highlight"
      );
    } finally {
      setIsCreatingHighlight(false);
    }
  };

  return (
    <div
      style={{
        background: `url('${story.image}') no-repeat center center/cover`,
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {userId === currentUser._id && (
        <div ref={dropdownRef}>
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={handleToggleDropdown}
          >
            <BsThreeDots size={20} />
          </button>

          {showDropdown && (
            <div className="story-dropdown">
              <button
                className="story-dropdown-item"
                onClick={handleHighlightClick}
              >
                <FaBookmark size={14} />
                <span>Add to Highlight</span>
              </button>
              <button
                className="story-dropdown-item"
                onClick={handleDeleteClick}
              >
                <FaTrash size={14} />
                <span>Delete Story</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Highlight Options Modal */}
      {showHighlightOptions && (
        <div
          className="story-highlight-overlay"
          onClick={() => setShowHighlightOptions(false)}
        >
          <div
            className="highlight-options-dialog"
            onClick={(e) => e.stopPropagation()}
            ref={highlightOptionsRef}
          >
            <h3>Add to Highlight</h3>

            {addToHighlightError && (
              <p className="highlight-error">{addToHighlightError}</p>
            )}

            {isLoadingHighlights ? (
              <div className="highlight-loading">Loading highlights...</div>
            ) : showCreateHighlight ? (
              <form
                onSubmit={handleCreateHighlight}
                className="create-highlight-form"
              >
                <input
                  type="text"
                  placeholder="Highlight name"
                  value={newHighlightName}
                  onChange={(e) => setNewHighlightName(e.target.value)}
                  className="highlight-name-input"
                  autoFocus
                />
                <div className="highlight-form-actions">
                  <button
                    type="button"
                    onClick={() => setShowCreateHighlight(false)}
                    className="cancel-button"
                    disabled={isCreatingHighlight}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="create-button"
                    disabled={!newHighlightName.trim() || isCreatingHighlight}
                  >
                    {isCreatingHighlight ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="highlight-list">
                  {highlights.length === 0 ? (
                    <p className="no-highlights">
                      You don't have any highlights yet.
                    </p>
                  ) : (
                    highlights.map((highlight) => (
                      <div
                        key={highlight._id}
                        className="highlight-item"
                        onClick={() => handleAddToHighlight(highlight._id)}
                      >
                        <div
                          className="highlight-cover"
                          style={{
                            backgroundImage: `url(${
                              highlight.coverImage || story.image
                            })`,
                          }}
                        />
                        <span className="highlight-name">{highlight.name}</span>
                      </div>
                    ))
                  )}
                </div>
                <button
                  className="new-highlight-button"
                  onClick={handleCreateHighlightClick}
                >
                  <FaPlus size={14} />
                  <span>Create New Highlight</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="story-confirmation" onClick={handleCancelDelete}>
          <div
            className="confirmation-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Story</h3>
            <p>
              Are you sure you want to delete this story? This action cannot be
              undone.
            </p>
            <div className="confirmation-actions">
              <button
                className="cancel-button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid white",
        }}
      >
        <img
          src={story.userId.profilePicture}
          alt={story.userId.username}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <p
        style={{
          position: "absolute",
          top: "30px",
          left: "80px",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "5px 10px",
          borderRadius: "5px",
        }}
      >
        {story.userId.username}
      </p>

      <p
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "5px 10px",
          borderRadius: "5px",
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        {story.content}
      </p>

      <button
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          color: "red",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        {isLiked ? (
          <FaHeart
            size={20}
            color="red"
            onClick={() => {
              handleStoryLike(story?._id);
              setIsLiked(!isLiked);
            }}
          />
        ) : (
          <FaRegHeart
            onClick={() => {
              handleStoryLike(story?._id);
              setIsLiked(!isLiked);
            }}
            size={20}
            color="black"
          />
        )}
      </button>
    </div>
  );
}
