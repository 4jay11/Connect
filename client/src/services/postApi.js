import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Get a single post by ID
export const getSinglePost = async (postId) => {
  const response = await axios.get(`${BASE_URL}/post/single/${postId}`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Get feed posts
export const getFeedPosts = async () => {
  const response = await axios.get(`${BASE_URL}/post/post-generator`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Create new post
export const createPost = async (postData) => {
  const response = await axios.post(`${BASE_URL}/post/addNewPost`, postData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Delete post
export const deletePost = async (postId) => {
  const response = await axios.delete(`${BASE_URL}/post/deletePost/${postId}`, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Update post
export const updatePost = async (postId, caption) => {
  const response = await axios.patch(
    `${BASE_URL}/post/update/${postId}`,
    { caption },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Get post comments
export const getPostComments = async (postId) => {
  const response = await axios.get(`${BASE_URL}/post/comments/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Add comment to post
export const addComment = async (postId, text) => {
  const response = await axios.post(
    `${BASE_URL}/post-reaction/comment/${postId}`,
    { text },
    { withCredentials: true }
  );
  return response.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await axios.delete(
    `${BASE_URL}/post-reaction/comment/${commentId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Like post
export const likePost = async (postId) => {
  const response = await axios.post(
    `${BASE_URL}/post-reaction/like/${postId}`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};

// Bookmark post
export const bookmarkPost = async (postId) => {
  const response = await axios.post(
    `${BASE_URL}/post-reaction/bookmark/${postId}`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return response.data;
};
