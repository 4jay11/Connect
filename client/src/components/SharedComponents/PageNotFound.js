import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaExclamationCircle,
  FaArrowLeft,
  FaHome,
  FaSearch,
} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import "./NotFound.css";

const PageNotFound = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="not-found-container page-not-found">
        <div className="not-found-content">
          <div className="not-found-icon page-icon">
            <FaExclamationCircle />
          </div>
          <h1>Page Not Found</h1>
          <p>
            Oops! The page you're looking for doesn't exist or has been moved.
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
              <FaSearch /> Explore
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
