import axios from "axios";
import { BASE_URL } from "./constants";

// Bookmarks
export const fetchBookmarks = async (setBookmarkedPosts) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/bookmark`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
      setBookmarkedPosts(response.data.posts || []);
  } catch (err) {
    console.error("Error fetching bookmarks:", err.message);
  }
};

// Chat Messages
export const fetchChatMessages = async (targetUserId , setMessages , userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chat = res.data;

      const chatMessages = chat?.messages.map((msg) => ({
        id: msg._id,
        side: msg.senderId?._id === userId ? "msg-right" : "msg-left",
        text: msg.text,
        timestamp: msg.createdAt,
        username: msg.senderId?.username,
      }));

      setMessages(chatMessages);

      return chat;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
      return null;
    }
};

export   const fetchChatMembers = async (setChatMembers) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/members`, {
      withCredentials: true,
    });
    setChatMembers(response.data);
  } catch (error) {
    console.error("Failed to fetch chat members:", error);
    setChatMembers([]);
  }
};
