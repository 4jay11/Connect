import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      console.error("getUserProfile called with invalid userId");
      return null;
    }

    // Use direct URL as specified in the user query
    const url = `http://localhost:8000/user/${userId}`;
    console.log("Fetching user profile from:", url);

    const response = await axios.get(url, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    // Validate response data
    if (!response.data || typeof response.data !== "object") {
      console.error("Invalid user data received from API");
      return null;
    }

    console.log("API response for user:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, formData) => {
  const response = await axios.patch(
    `${BASE_URL}/user/update/${userId}`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// Get user highlights
export const getUserHighlights = async (userId) => {
  const response = await axios.get(`${BASE_URL}/highlight/user/${userId}`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
