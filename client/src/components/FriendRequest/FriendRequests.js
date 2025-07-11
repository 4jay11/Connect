import React, { useEffect, useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import FriendRequestCard from "./FriendRequestCard";
import "./FriendRequest.css";
import { getAllFriendRequests } from "../../services/connectionApi";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/Slices/authSlice";
const FriendRequests = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchFriendRequests = async () => {
      try {
        const data = await getAllFriendRequests();
        setFriendRequests(data || []);
      } catch (err) {
        console.error("Error fetching friend requests:", err);
        setError(
          err.response?.data?.error || "Failed to load friend requests."
        );
        if (err.response?.data?.error == "User not logged in") {
          showToast("Session expired. Please login again.", "error");
          dispatch(logout());
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [friendRequests]);

  // Function to remove request from state after action
  const handleRequestAction = (id) => {
    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.senderId._id !== id)
    );
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="friend-requests">
      {friendRequests.length === 0 ? (
        <p>No friend requests</p>
      ) : (
        friendRequests.map((request) => {
          if (!request.senderId) return null;

          const mutualConnections = request.senderId.following.filter((id) =>
            currentUser.following.includes(id)
          ).length;

          return (
            <FriendRequestCard
              key={request._id}
              requestid={request._id}
              userid={request.senderId._id}
              username={request.senderId.username}
              profilePhoto={request.senderId.profilePicture}
              mutual={mutualConnections}
              onRequestHandled={handleRequestAction}
            />
          );
        })
      )}
    </div>
  );
};

export default FriendRequests;
