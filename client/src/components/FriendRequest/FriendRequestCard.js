import React from "react";
import { useNavigate } from "react-router-dom";
import { acceptFriendRequest, declineFriendRequest } from "../../services";

const FriendRequests = ({
  profilePhoto,
  username,
  mutual,
  requestid,
  userid,
  onRequestHandled,
}) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile/" + userid);
  };

  const acceptRequest = async () => {
    try {
      await acceptFriendRequest(requestid);
      console.log("Friend request accepted:");
      onRequestHandled(requestid);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineRequest = async () => {
    try {
      await declineFriendRequest(requestid);
      console.log("Friend request declined");
      onRequestHandled(requestid);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="friend-request-card">
      <div className="friend-request-info" onClick={handleProfileClick}>
        <img src={profilePhoto} alt={username} className="profile-photo" />
        <div className="friend-request-details">
          <h3>{username}</h3>
          <p>{mutual} mutual friends</p>
        </div>
      </div>
      <div className="friend-request-actions">
        <button className="accept-btn" onClick={acceptRequest}>
          Accept
        </button>
        <button className="decline-btn" onClick={declineRequest}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default FriendRequests;
