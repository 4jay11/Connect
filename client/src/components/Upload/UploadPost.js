import React, { useState, useEffect } from "react";
import "./UploadPost.css";

import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import useGeolocation from "../../hooks/useGeolocation";
import { uploadFile } from "../../utils/post";
import { createPost } from "../../services/postApi";
import { FaImage, FaCheck, FaTimes } from "react-icons/fa";

const UploadPost = () => {
  const [content, setContent] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const location = useGeolocation();

  // Fetch user ID (replace with actual authentication logic)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    setUserId(user._id);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // const uploadFile = async () => {
  //   if (!imgFile) return null; // Skip if no image selected

  //   const data = new FormData();
  //   data.append("file", imgFile);
  //   data.append("upload_preset", "images_preset");

  //   try {
  //     const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  //     const api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  //     const res = await axios.post(api, data);
  //     return res.data.secure_url; // Return full Cloudinary URL
  //   } catch (error) {
  //     console.error("Cloudinary upload error:", error);
  //     throw error;
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage("User not authenticated.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const imageUrl = imgFile ? await uploadFile(imgFile) : null;

      const res = createPost({
        userId,
        content: content,
        image: imageUrl,
        location,
      });

      setMessage("Post added successfully");
      setImgFile(null);
      setImgPreview(null);
      setContent("");
      navigate("/feed");
    } catch (error) {
      console.error("Error posting data:", error);
      setMessage("Error during post creation");
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
        <h2>Create New Post</h2>
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
                <FaCheck /> Share Post
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
                <span>Required for Post</span>
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

export default UploadPost;