import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Login user
export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${BASE_URL}/login`,
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

// Register user
export const registerUser = async (username, email, password) => {
  const response = await axios.post(
    `${BASE_URL}/register`,
    { username, email, password },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await axios.post(
    `${BASE_URL}/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// Search users
export const searchUsers = async (searchTerm) => {
  const response = await axios.get(`${BASE_URL}/user/search?q=${searchTerm}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
