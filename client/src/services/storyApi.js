import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Delete story
export const deleteStory = async (storyId) => {
  const response = await axios.delete(
    `${BASE_URL}/story/deleteStory/${storyId}`,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Like a story
export const likeStory = async (storyId) => {
  const response = await axios.patch(
    `${BASE_URL}/story/like/${storyId}`,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Get all stories
export const getStories = async () => {
  const response = await axios.get(`${BASE_URL}/story/getStories`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Add a story to a highlight
export const addStoryToHighlight = async (highlightId, storyId) => {
  const response = await axios.patch(
    `${BASE_URL}/highlight/add-story`,
    { highlightId, storyId },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Create a new highlight
export const createHighlight = async (name, storyId, coverImage) => {
  const response = await axios.post(
    `${BASE_URL}/highlight/create`,
    { name, storyId, coverImage },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const deleteHighlight = async (highlightId) => {
  const response = await axios.delete(`${BASE_URL}/highlight/${highlightId}`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  console.log("APi", response);
  return response.data;
};

export const deleteStoryFromHighlight = async (highlightId, storyId) => {
  const response = await axios.patch(
    `${BASE_URL}/highlight/remove-story`,
    { highlightId, storyId },
    { withCredentials: true, headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

// Add a new story
export const addNewStory = async (content, image) => {
  const response = await axios.post(
    `${BASE_URL}/story/addNewStory`,
    { content, image },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};
