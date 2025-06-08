import React, { useState } from "react";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import {
  UilHeart,
  UilCommentDots,
  UilBookmarkFull,
} from "@iconscout/react-unicons";
import "./Feeds.css";

const PostComments = ({
  comments = [],
  expandedComments = {},
  setExpandedComments,
  handleDelete,
  onCommentSubmit,
  onClose,
  userId
}) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onCommentSubmit(comment);
      setComment("");
    }
  };

  return (
    <div className="right-comments">
      <div className="top-comments">
        <FaArrowLeft
          onClick={onClose}
          style={{ display: "inline-block", marginRight: "10px" }}
        />
        <h3 style={{ display: "inline-block" }}>Comments</h3>
      </div>

      <div className="comments-scrollable">
        <div className="comments-section">
          {Array.isArray(comments) &&
            comments.map((comment) => {
              const text = comment?.text || "";
              const isLong = text.length > 60;
              const isExpanded =
                comment?._id && expandedComments?.[comment._id];

              return (
                <div
                  className="comment"
                  key={comment?._id || Math.random()}
                  style={{ position: "relative" }}
                >
                  <img
                    className="comment-img"
                    src={comment?.userId?.profilePicture}
                    alt={comment?.userId?.username || "user"}
                  />
                  <div className="comment-content">
                    <strong>{comment?.userId?.username}</strong>{" "}
                    {isLong && !isExpanded ? `${text.slice(0, 60)}...` : text}
                    {isLong && (
                      <span
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [comment._id]: !prev[comment._id],
                          }))
                        }
                        style={{
                          color: "#007bff",
                          cursor: "pointer",
                          marginLeft: "6px",
                        }}
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </span>
                    )}
                  </div>

                  {userId === comment?.userId?._id && (
                    <div
                    className="deleteIcon"
                    onClick={() => handleDelete(comment._id)}
                  >
                    <FaTrashAlt />
                  </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostComments;
