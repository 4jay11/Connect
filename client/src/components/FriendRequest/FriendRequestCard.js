import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const response = await axios.patch(
        `http://localhost:8000/connection/request/accept/${requestid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, 
        }
      );

      console.log("Friend request accepted:", response.data);
      onRequestHandled(requestid);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineRequest = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/connection/${requestid}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Friend request declined:", response.data);
      onRequestHandled(requestid);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="friend-requests">
      <div className="request">
        <div className="info">
          <div className="profile-photo">
            <img
              onClick={handleProfileClick}
              src={profilePhoto}
              alt="Profile"
            />
          </div>
          <div>
            <h5>{username}</h5>
            <p className="text-muted">{mutual} mutual friends</p>
          </div>
        </div>
        <div className="action">
          <button className="btn btn-primary" onClick={acceptRequest}>
            Accept
          </button>
          <button className="btn" onClick={declineRequest}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;