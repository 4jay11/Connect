import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Create a new chat with a user
export const createChat = async (targetUserId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat`,
      { targetUserId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

// Send a new message to a chat
export const sendMessage = async (targetUserId, text) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/message/${targetUserId}`,
      { text },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Get chat messages
export const getChatMessages = async (targetUserId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting chat messages:", error);
    throw error;
  }
};

// Delete specific chat messages
export const deleteChatMessages = async (
  chatId,
  messageIds,
  deleteForEveryone = false
) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteChats/${chatId}`, {
      withCredentials: true,
      data: {
        messageIds,
        deleteForEveryone,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting chat messages:", error);
    throw error;
  }
};

// Delete entire chat with a user
export const deleteChat = async (targetUserId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/chat/${targetUserId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

// Fetch chat members (participants except current user)
export const fetchChatMembers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/members`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat members:", error);
    throw error;
  }
};

// Fetch chat messages and transform for UI
export const fetchChatMessages = async (targetUserId, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
      withCredentials: true,
    });

    const chat = response.data;

    const chatMessages =
      chat?.messages.map((msg) => ({
        id: msg._id,
        side: msg.senderId?._id === userId ? "msg-right" : "msg-left",
        text: msg.text,
        timestamp: msg.createdAt,
        username: msg.senderId?.username,
      })) || [];

    return { chat, chatMessages };
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};