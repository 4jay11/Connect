import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./SidebarNav.css";

// Icons
import {
  UilHome,
  UilEnvelope,
  UilCompass,
  UilBookmark,
  UilUser,
  UilBars,
  UilAngleRight,
} from "@iconscout/react-unicons";

const SidebarNav = ({ className, showSocialName, isCollapsible = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    // Auto-collapse when on chat page
    if (location.pathname.startsWith("/chat")) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [location.pathname]);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const navigateToProfile = () => {
    navigate(`/profile/${currentUser?._id}`);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`sidebar-nav ${className || ""} ${
        collapsed ? "collapsed" : ""
      } ${isMobile ? "mobile" : ""}`}
    >
      {isMobile ? null : (
        <>
          {showSocialName && (
            <div className="social-name">
              {collapsed ? (
                <div className="logo-small">
                  <img src="/image.png" alt="Logo" />
                </div>
              ) : (
                <div className="logo-container">
                  <img src="/image.png" alt="Logo" />
                  <h2>Social</h2>
                </div>
              )}
              {isCollapsible && (
                <button className="collapse-btn" onClick={toggleCollapse}>
                  {collapsed ? <UilAngleRight /> : <UilBars />}
                </button>
              )}
            </div>
          )}

          <div className="sidebar-links">
            <div
              className={`sidebar-link ${isActive("/feed") ? "active" : ""}`}
              onClick={() => navigateTo("/feed")}
            >
              <UilHome size="24" />
              {!collapsed && <span>Home</span>}
            </div>
            <div
              className={`sidebar-link ${isActive("/chat") ? "active" : ""}`}
              onClick={() => navigateTo("/chat")}
            >
              <UilEnvelope size="24" />
              {!collapsed && <span>Messages</span>}
            </div>
            <div
              className={`sidebar-link ${isActive("/explore") ? "active" : ""}`}
              onClick={() => navigateTo("/explore")}
            >
              <UilCompass size="24" />
              {!collapsed && <span>Explore</span>}
            </div>
            <div
              className={`sidebar-link ${
                isActive("/bookmark") ? "active" : ""
              }`}
              onClick={() => navigateTo("/bookmark")}
            >
              <UilBookmark size="24" />
              {!collapsed && <span>Bookmarks</span>}
            </div>
          </div>

          <div className="sidebar-profile" onClick={navigateToProfile}>
            <div className="profile-image">
              <img
                src={
                  currentUser?.profilePicture ||
                  "https://via.placeholder.com/40"
                }
                alt="Profile"
              />
            </div>
            {!collapsed && (
              <div className="profile-info">
                <h4>{currentUser?.username || "User"}</h4>
                <p>@{currentUser?.username?.toLowerCase() || "username"}</p>
              </div>
            )}
          </div>
        </>
      )}

      {isMobile && (
        <div className="mobile-nav">
          <div
            className={`mobile-nav-item ${isActive("/feed") ? "active" : ""}`}
            onClick={() => navigateTo("/feed")}
          >
            <UilHome size="24" />
          </div>
          <div
            className={`mobile-nav-item ${isActive("/chat") ? "active" : ""}`}
            onClick={() => navigateTo("/chat")}
          >
            <UilEnvelope size="24" />
          </div>
          <div
            className={`mobile-nav-item ${
              isActive("/explore") ? "active" : ""
            }`}
            onClick={() => navigateTo("/explore")}
          >
            <UilCompass size="24" />
          </div>
          <div
            className={`mobile-nav-item ${
              isActive("/bookmark") ? "active" : ""
            }`}
            onClick={() => navigateTo("/bookmark")}
          >
            <UilBookmark size="24" />
          </div>
          <div
            className={`mobile-nav-item ${
              isActive("/profile") ? "active" : ""
            }`}
            onClick={navigateToProfile}
          >
            <div className="mobile-profile-image">
              <img
                src={
                  currentUser?.profilePicture ||
                  "https://via.placeholder.com/40"
                }
                alt="Profile"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  showSocialName: PropTypes.bool,
  isCollapsible: PropTypes.bool,
};

SidebarNav.defaultProps = {
  showSocialName: false,
  isCollapsible: false,
};

export default SidebarNav;
