import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCamera, FaArrowLeft } from "react-icons/fa";
import { FiArrowLeft, FiCamera } from "react-icons/fi";
import { updateUser } from "../../redux/Slices/authSlice"; // Assuming this action exists
import Navbar from "../Navbar/Navbar";
import "./EditProfile.css";

const EditProfile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    email: currentUser?.email || "",
    profilePicture: currentUser?.profilePicture || "",
  });

  const [previewImage, setPreviewImage] = useState(
    currentUser?.profilePicture || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // In a real app, you would upload this to your server and get a URL back
    // For now, we'll just store the file in formData
    setFormData((prev) => ({
      ...prev,
      profilePictureFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app, you would upload the image first if it changed
      // Then update the user profile with the new image URL

      // For now, we'll simulate an API call
      const updatedUser = {
        ...currentUser,
        username: formData.username,
        bio: formData.bio,
        email: formData.email,
        profilePicture: previewImage, // In a real app, this would be the URL from your server
      };

      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would make an API call like:
      // const response = await axios.put(`http://localhost:8000/user/${currentUser._id}`, formData, {
      //   withCredentials: true,
      // });
      // dispatch(updateUser(response.data));

      // For now, just update the Redux store
      dispatch(updateUser(updatedUser));

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <button className="back-button" onClick={() => navigate("/profile")}>
            <FaArrowLeft />
          </button>
          <h2>Edit Profile</h2>
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="profile-picture-editor">
            <div className="profile-picture-container">
              <img
                src={previewImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-picture-preview"
              />
              <label
                htmlFor="profile-picture-input"
                className="profile-picture-overlay"
              >
                <FaCamera />
                <span>Change Photo</span>
              </label>
              <input
                type="file"
                id="profile-picture-input"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
