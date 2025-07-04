import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const getHighlights = async (userId) => {
  const response = await axios.get(`${BASE_URL}/highlight/user/${userId}`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
