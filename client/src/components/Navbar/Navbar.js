import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/Slices/authSlice";
import {
  UilSearch,
  UilPlus,
  UilImage,
  UilVideo,
} from "@iconscout/react-unicons";
import debounce from "lodash.debounce";
import axios from "axios";
import "./Navbar.css";
import { useToast } from "../../context/ToastContext";

const Navbar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const id = currentUser._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const uploadMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const searchBarRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(event.target)
      ) {
        setShowUploadMenu(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async (searchTerm) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/search?q=${searchTerm}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchUsers, 500), []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) debouncedSearch(value);
    else setResults([]);
  };

  const handleSelectUser = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery("");
    setResults([]);
  };

  const handleHomeClick = () => navigate("/");
  const handleProfileClick = () => {
    navigate(`/profile/${id}`);
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      showToast("Logged out successfully!", "success");
      dispatch(logout());
      navigate("/login");
        
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("Logout failed. Please try again.", "error");
    }
  };

  const handleUploadClick = () => {
    setShowUploadMenu(!showUploadMenu);
  };

  const handleStoryUpload = () => {
    navigate("/story-upload");
    setShowUploadMenu(false);
  };

  const handlePostUpload = () => {
    navigate("/upload");
    setShowUploadMenu(false);
  };

  return (
    <nav>
      <div className="container">
        <h2 className="log" onClick={handleHomeClick}>
          Social
        </h2>

        <div className="search-bar" ref={searchBarRef}>
          <UilSearch  style={{ color: "#555" }} />
          <input
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search"
          />
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((user) => (
                <li key={user._id} onClick={() => handleSelectUser(user._id)}>
                  <img src={user.profilePicture} alt="profile" />
                  <div>
                    <span>@{user.userId}</span>
                    <small>{user.username}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="create">
          <div className="upload-container" ref={uploadMenuRef}>
            <button className="upload-button" onClick={handleUploadClick}>
              <UilPlus size="24" />
            </button>
            {showUploadMenu && (
              <div className="upload-menu">
                <div className="upload-option" onClick={handleStoryUpload}>
                  <UilVideo size="20" />
                  <span>Create Story</span>
                </div>
                <div className="upload-option" onClick={handlePostUpload}>
                  <UilImage size="20" />
                  <span>Create Post</span>
                </div>
              </div>
            )}
          </div>

          <div
            className="profile-photo"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src={currentUser.profilePicture} alt="Profile" />
          </div>
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-option" onClick={handleProfileClick}>
                <span>View Profile</span>
              </div>
              <div className="profile-option" onClick={handleLogout}>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
