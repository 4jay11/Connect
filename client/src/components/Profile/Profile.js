import React, { useState, useRef } from "react";
import "./Profile.css";
import { UilEdit } from "@iconscout/react-unicons";
import Navbar from "../Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const user = useSelector((state) => state.auth.user);
  const [currentUser, setCurrentuser] = useState(user);
  const [profileImage, setProfileImage] = useState(user.profilePicture || "");
  const [description, setDescription] = useState(user.bio || "");
  const [name, setName] = useState(user.username);
  const [username, setUsername] = useState(user.username);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const hasChanges = () => {
    return (
      file !== null ||
      description !== (user.bio || "") ||
      name !== user.username ||
      username !== user.username
    );
  };

  const handleSaveChanges = async () => {
    if (!hasChanges()) {
      showToast("No changes made to save.", "error");
      return;
    }

    try {
      const formData = new FormData();
      if (file) formData.append("image", file);
      formData.append("bio", description);
      formData.append("name", name);
      formData.append("username", username);

      const res = await axios.patch(
        `http://localhost:8000/user/update/${user._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!res) showToast("Failed to update profile", "error");
      showToast("Profile updated successfully!", "success");
      dispatch(loginSuccess(res.data));
      setCurrentuser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleback = () => {
    navigate(-1);
  };

  return (
    <div>
      <Navbar currentUser={currentUser} />
      <div className="profile-container">
        <div className="profile-head">
          <div className="profile-image-container">
            <img src={profileImage} alt="Profile" className="profile-image" />
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="file-input"
                  onChange={handleImageChange}
                />
                <button
                  onClick={handleFileButtonClick}
                  className="change-image-button"
                >
                  Change Picture
                </button>
              </>
            )}
            <div className="action-buttons">
              <button
                onClick={handleback}
                className="edit-profile-button"
              >
                Back
              </button>
            </div>
          </div>

          <div className="profile-info">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="edit-input"
                  placeholder="Username"
                />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="edit-input"
                  placeholder="Full Name"
                />
              </>
            ) : (
              <>
                <h1>
                  {username}{" "}
                  <UilEdit onClick={handleEditToggle} className="edit-icon" />
                </h1>
                <p>{name}</p>
              </>
            )}

            <div className="profile-body">
              {isEditing && <h2>About</h2>}
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  className="edit-input"
                />
              ) : (
                <p>{description}</p>
              )}
            </div>

            <div className="profile-stats">
              <span>Following: {currentUser?.following?.length || 0}</span>
              <span>Followers: {currentUser?.followers?.length || 0}</span>
            </div>

            {isEditing && (
              <div className="action-buttons">
                <button
                  onClick={handleSaveChanges}
                  className="edit-profile-button"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
