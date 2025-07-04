import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserSlash, FaArrowLeft, FaHome, FaSearch } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "../SharedComponents/NotFound.css";
import "./UserNotFound.css";

const UserNotFound = ({ currentUser, userId }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="not-found-container user-not-found">
        <div className="not-found-content">
          <div className="not-found-icon user-icon">
            <FaUserSlash />
          </div>
          <h1>User Not Found</h1>
          <p>
            Sorry, the user with ID <strong>{userId}</strong> doesn't exist or
            has been removed. This profile may have been deleted or the URL
            might be incorrect.
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
              onClick={() => navigate("/feed")}
            >
              <FaHome /> Go Home
            </button>
            <button
              className="not-found-button explore-button"
              onClick={() => navigate("/explore")}
            >
              <FaSearch /> Find Users
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserNotFound;
