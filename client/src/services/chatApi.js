import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Get chat messages
export const getChatMessages = async (targetUserId) => {
  const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Delete chat messages
export const deleteChatMessages = async (
  chatId,
  messageIds,
  deleteForEveryone = false
) => {
  const response = await axios.delete(`${BASE_URL}/deleteChats/${chatId}`, {
    withCredentials: true,
    data: {
      messageIds,
      deleteForEveryone,
    },
  });
  return response.data;
};

// Delete entire chat with a user
export const deleteChat = async (targetUserId) => {
  const response = await axios.delete(`${BASE_URL}/chat/${targetUserId}`, {
    withCredentials: true
  });
  return response.data;
};

// Fetch chat members
export const fetchChatMembers = async () => {
  const response = await axios.get(`${BASE_URL}/chat/members`, {
    withCredentials: true,
  });
  return response.data;
};

// Fetch chat messages and map for UI
export const fetchChatMessages = async (targetUserId, userId) => {
  const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
    withCredentials: true,
  });
  const chat = response.data;
  const chatMessages = chat?.messages.map((msg) => ({
    id: msg._id,
    side: msg.senderId?._id === userId ? "msg-right" : "msg-left",
    text: msg.text,
    timestamp: msg.createdAt,
    username: msg.senderId?.username,
  }));
  return { chat, chatMessages };
};
 