import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { FaImage, FaCheck, FaTimes } from "react-icons/fa";
import "./StoryUploader.css";

const StoryUploader = () => {
  const [content, setContent] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const uploadFile = async () => {
    if (!imgFile) return null;

    const data = new FormData();
    data.append("file", imgFile);
    data.append("upload_preset", "images_preset");

    try {
      const cloudName =
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "djzvzxpxy";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imgFile) {
      setMessage("Please select an image for your story");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const imageUrl = await uploadFile();

      const res = await axios.post(
        "http://localhost:8000/story/addNewStory",
        {
          content,
          image: imageUrl,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Story created:", res.data);
      setMessage("Story added successfully");

      // Reset form
      setImgFile(null);
      setImgPreview(null);
      setContent("");

      // Redirect to feed after short delay
      setTimeout(() => {
        navigate("/feed");
      }, 1500);
    } catch (error) {
      console.error("Error creating story:", error);
      setMessage(error.response?.data?.message || "Error creating story");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/feed");
  };

  return (
    <div className="story-uploader-container">
      <div className="story-uploader-header">
        <h2>Create New Story</h2>
        <div className="story-uploader-actions">
          <button
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            <FaTimes /> Cancel
          </button>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!imgFile || loading}
          >
            {loading ? (
              <ThreeDots height="20" width="30" color="#ffffff" />
            ) : (
              <>
                <FaCheck /> Share Story
              </>
            )}
          </button>
        </div>
      </div>

      <div className="story-uploader-content">
        <div className="image-upload-container">
          <label htmlFor="storyImageInput" className="image-upload-label">
            {imgPreview ? (
              <img
                src={imgPreview}
                alt="Story preview"
                className="story-image-preview"
              />
            ) : (
              <div className="image-upload-placeholder">
                <FaImage size={40} />
                <p>Click to upload image</p>
                <span>Required for story</span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="storyImageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
        </div>

        <div className="story-text-container">
          <textarea
            placeholder="Add a caption to your story (optional)"
            value={content}
            onChange={handleContentChange}
            className="story-text-input"
            maxLength={100}
          />
          <div className="character-count">{content.length}/100</div>
        </div>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("Error") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default StoryUploader;