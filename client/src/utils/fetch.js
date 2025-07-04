import { getBookmarksPosts } from "../services/bookmarkApi";
import { fetchChatMessages, fetchChatMembers } from "../services/chatApi";

// Bookmarks
export const fetchBookmarks = async (setBookmarkedPosts) => {
  try {
    const posts = await getBookmarksPosts();
    if (setBookmarkedPosts) {
      setBookmarkedPosts(posts);
    }
    return posts;
  } catch (err) {
    console.error("Error fetching bookmarks:", err.message);
    if (setBookmarkedPosts) {
      setBookmarkedPosts([]);
    }
    return [];
  }
};

// Chat Messages
export const fetchChatMessagesForUI = async (
  targetUserId,
  setMessages,
  userId
) => {
  try {
    const { chat, chatMessages } = await fetchChatMessages(
      targetUserId,
      userId
    );
    setMessages(chatMessages);
    return chat;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    setMessages([]);
    return null;
  }
};

export const fetchChatMembersForUI = async (setChatMembers) => {
  try {
    const members = await fetchChatMembers();
    setChatMembers(members);
  } catch (error) {
    console.error("Failed to fetch chat members:", error);
    setChatMembers([]);
  }
};
