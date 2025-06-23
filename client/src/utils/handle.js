import { fetchChatMessagesForUI } from "./fetch";
import { fetchChatMessages, deleteChatMessages } from "../services/chatApi";

// Chat Members and Messages
export const handleChat = async (
  targetUserId,
  chatMembers,
  setActiveFriend,
  setMessages,
  setChatMembers,
  userId
) => {
  console.log("handleChat");
  if (targetUserId && chatMembers.length >= 0) {
    const friend = chatMembers.find((member) => member._id === targetUserId);

    if (friend) {
      setActiveFriend(friend);
      fetchChatMessagesForUI(friend._id, setMessages, userId);
    } else {
      const chat = await fetchChatMessagesForUI(
        targetUserId,
        setMessages,
        userId
      );

      // Extract the participant
      const otherUser = chat?.participants?.find((user) => user._id !== userId);

      if (otherUser) {
        setChatMembers((prev) => [...prev, otherUser]);
        setActiveFriend(otherUser);
      }
    }
  }
};

// Chat Delete

export const handledelete = async (
  id,
  selectedLeft,
  selectedRight,
  setMessages
) => {
  const deleteForEveryone = selectedLeft.length === 0;

  try {
    await deleteChatMessages(
      id,
      [...selectedLeft, ...selectedRight],
      deleteForEveryone
    );
    // Just remove from local state without re-fetching all messages
    setMessages((prevMessages) =>
      prevMessages.filter(
        (msg) => ![...selectedLeft, ...selectedRight].includes(msg.id)
      )
    );
  } catch (error) {
    console.error("Error deleting chats:", error);
  }
};
