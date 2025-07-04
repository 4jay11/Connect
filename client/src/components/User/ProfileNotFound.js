import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaHome,
  FaUser,
} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "../SharedComponents/NotFound.css";
import "./UserNotFound.css";

const ProfileNotFound = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="not-found-container profile-not-found">
        <div className="not-found-content">
          <div className="not-found-icon profile-icon">
            <FaExclamationTriangle />
          </div>
          <h1>Profile ID Required</h1>
          <p>
            Please provide a valid user ID to view a profile. You can search for
            users or view your own profile instead.
          </p>

          <div className="not-found-actions">
            <button
              className="not-found-button back-button"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> Go Back
            </button>
            <button
              className="not-found-button home-button"
              onClick={() => navigate("/profile")}
            >
              <FaUser /> My Profile
            </button>
            <button
              className="not-found-button explore-button"
              onClick={() => navigate("/explore")}
            >
              <FaHome /> Explore
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileNotFound;
