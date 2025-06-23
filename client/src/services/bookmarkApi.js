import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Get user bookmarks
export const getBookmarks = async () => {
  const response = await axios.get(`${BASE_URL}/user/bookmark`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Get user bookmarks (returns posts array)
export const getBookmarksPosts = async () => {
  const response = await axios.get(`${BASE_URL}/user/bookmark`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data.posts || [];
};
