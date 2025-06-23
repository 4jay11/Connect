import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Accept friend request
export const acceptFriendRequest = async (requestId) => {
  const response = await axios.patch(
    `${BASE_URL}/connection/request/accept/${requestId}`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

// Decline friend request
export const declineFriendRequest = async (requestId) => {
  const response = await axios.delete(`${BASE_URL}/connection/${requestId}`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

// Send a connection request
export const sendConnectionRequest = async (targetUserId) => {
  const response = await axios.post(
    `${BASE_URL}/connection/request/${targetUserId}`,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Get all friend requests
export const getAllFriendRequests = async () => {
  const response = await axios.get(`${BASE_URL}/connection/all-requests/`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};
