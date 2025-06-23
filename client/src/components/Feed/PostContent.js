import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  UilBookmarkFull,
  UilHeart,
  UilCommentDots,
} from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const PostContent = ({
  profilePhoto,
  user_id,
  username,
  location,
  timeAgo,
  feedPhoto,
  likedBy,
  onLike,
  onBookmark,
  post_id,
  bookmarkBy,
  editable,
  isEditing,
  setIsEditing,
  editedCaption,
  setEditedCaption,
  handlePostDelete,
  handlePostEdit,
  caption,
  setShowHighlight,
}) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?._id);
  const hasLiked = likedBy.some((user) => user._id === userId);
  const hasBookmarked = bookmarkBy.includes(userId);

  const handleUpdate = () => {
    handlePostEdit(post_id, editedCaption);
    setIsEditing(false);
  };

  return (
    <div className="feed">
      <div className="head">
        <div className="user">
          <div className="profile-pic">
            <img
              onClick={() => navigate(`/profile/${user_id}`)}
              src={profilePhoto}
              alt={username}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="info">
            <h3>{username}</h3>
            <small>{`${location}, ${timeAgo}`}</small>
          </div>
        </div>
      </div>

      <div className="photo">
        <img src={feedPhoto} alt="Feed" />
      </div>

      <div className="action-buttons">
        <div style={{ display: "flex", gap: "10px", padding: "5px 0" }}>
          <UilHeart
            color="black"
            fill={hasLiked ? "red" : "black"}
            onClick={() => onLike(post_id)}
            style={{ cursor: "pointer" }}
          />
          <UilCommentDots
            onClick={() => setShowHighlight(true)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          className="bookmark"
          style={{ display: "flex", gap: "10px", padding: "5px 0" }}
        >
          <UilBookmarkFull
            color="black"
            fill={hasBookmarked ? "red" : "black"}
            onClick={() => onBookmark(post_id)}
            style={{ cursor: "pointer" }}
          />
          {editable && (
            <FaTrashAlt
              style={{ cursor: "pointer" }}
              onClick={() => handlePostDelete(post_id)}
            />
          )}
          {editable && !isEditing && (
            <FaEdit
              style={{ cursor: "pointer", fontSize: "24px" }}
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>

      <div className="liked-by">
        {likedBy.length > 0 ? (
          <>
            {likedBy.slice(0, 3).map((user, index) => (
              <span key={index}>
                <img
                  src={user?.profilePicture || ""}
                  alt={user?.username || "liked user"}
                />
              </span>
            ))}
            <p>
              Liked by <b>{likedBy[0]?.username || "someone"}</b>{" "}
              {likedBy.length > 1 && `and ${likedBy.length - 1} others`}
            </p>
          </>
        ) : (
          <p>No likes yet</p>
        )}
      </div>

      <div className="caption">
        {editable ? (
          isEditing ? (
            <>
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={handleUpdate}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  marginTop: "8px",
                  marginLeft: "8px",
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <p style={{ fontSize: "14px", marginBottom: "6px" }}>
              {editedCaption}
            </p>
          )
        ) : (
          <p style={{ fontSize: "14px", marginBottom: "6px" }}>{caption}</p>
        )}
      </div>

      <div
        className="comments text-muted"
        onClick={() => setShowHighlight(true)}
        style={{ cursor: "pointer" }}
      >
        View all comments
      </div>
    </div>
  );
};

export default PostContent;
