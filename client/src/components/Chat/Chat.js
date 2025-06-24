import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../config/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import ChatFriendsList from "./ChatFriendList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";

import "./Chat.css";
import "./EmptyChat.css";

import { fetchChatMessages, fetchChatMembersForUI } from "../../utils/fetch";
import { handleChat } from "../../utils/handle";
import { sendMessage } from "../../utils/post";
import { handledelete } from "../../utils/handle";
import useWindowResize from "../../hooks/useWindowResize";
import { getUserProfile } from "../../services/userApi";
import { deleteChat } from "../../services/chatApi";

const Chat = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const navigate = useNavigate();
  const { targetUserId } = useParams();
  const isMobileView = useWindowResize();
  const [showChat, setShowChat] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [messages, setMessages] = useState([]);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFriend, setActiveFriend] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const [reloadChatMembers, setReloadChatMembers] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);
  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState("");
  const [showSelectMode, setShowSelectMode] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleChatdelete = async (id) => {
    try {
      handledelete(id, selectedLeft, selectedRight, setMessages);
      setSelectedLeft([]);
      setSelectedRight([]);
      setShowSelectMode(false);
      setCheckboxVisible(false);
    } catch (error) {
      console.error("Error deleting chats:", error);
    }
  };

  const handleDeleteChat = async (targetUserId) => {
    if (!targetUserId) return;

    setConfirmationType("deleteChat");
    setShowConfirmation(true);
  };

  const handleConfirmDeleteChat = async () => {
    try {
      if (!activeFriend?._id) {
        console.error("No active friend selected");
        return;
      }

      console.log("Deleting chat with user:", activeFriend._id);
      await deleteChat(activeFriend._id);

      // Update local state to reflect the deletion
      setChatMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== activeFriend._id)
      );

      // If we're viewing the deleted chat, navigate back to the main chat view
      if (targetUserId === activeFriend._id) {
        setActiveFriend(null);
        setMessages([]);
        navigate("/chat");
      }

      setShowConfirmation(false);
      setReloadChatMembers((prev) => !prev); // Trigger reload of chat members
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleSelectToggle = (id, side) => {
    setCheckboxVisible(true);
    const updater = side === "msg-left" ? setSelectedLeft : setSelectedRight;
    const selectedArray = side === "msg-left" ? selectedLeft : selectedRight;
    const updated = selectedArray.includes(id)
      ? selectedArray.filter((item) => item !== id)
      : [...selectedArray, id];
    updater(updated);
  };

  const handleSelectMessages = () => {
    setShowSelectMode(true);
    setCheckboxVisible(true);
    setSelectedLeft([]);
    setSelectedRight([]);
    setShowMenu(false);
  };

  const handleClearChat = () => {
    setConfirmationType("clearChat");
    setShowConfirmation(true);
    setShowMenu(false);
  };

  const handleConfirmClearChat = async () => {
    try {
      // Clear all messages for this chat
      setMessages([]);
      // Here you would typically also make an API call to clear messages in the backend
      // For example: await axios.delete(`${BASE_URL}/api/chat/${activeFriend._id}/clear`);

      setShowConfirmation(false);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleConfirmDeleteMessages = () => {
    handleChatdelete(activeFriend?._id);
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const fetchFollowingUsers = async () => {
    if (!user?.following || user.following.length === 0) {
      console.log("No following users found in Redux state:", user?.following);
      return;
    }

    console.log("Following users from Redux:", user.following);
    setIsLoading(true);
    try {
      const followingData = await Promise.all(
        user.following.map(async (followingId) => {
          if (!followingId) return null;

          try {
            console.log("Fetching user data for ID:", followingId);
            const userData = await getUserProfile(followingId);
            console.log("Received user data:", userData);

            // Check for different possible response structures
            // Some APIs return { user: {...} } instead of direct user object
            const userObject = userData?.user || userData;

            // Validate that we have a proper user object with at least an ID
            if (userObject && userObject._id) {
              return userObject;
            }
            return null;
          } catch (error) {
            console.error(`Error fetching user ${followingId}:`, error);
            return null;
          }
        })
      );

      // Filter out null values and ensure we have valid user objects
      const validUsers = followingData.filter(
        (user) => user !== null && typeof user === "object"
      );

      console.log("Valid users after filtering:", validUsers);
      setFollowingUsers(validUsers);
    } catch (error) {
      console.error("Error fetching following users:", error);
      setFollowingUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlusIconClick = () => {
    console.log("Current user from Redux:", user);
    console.log("User following array:", user?.following);

    // Fetch following users directly without the test code
    setShowFollowingList(true);
    fetchFollowingUsers();
  };

  const startNewChat = (selectedUser) => {
    navigate(`/chat/${selectedUser._id}`);
    setShowFollowingList(false);
  };

  const handleSelectAll = () => {
    // Select all messages
    const leftIds = messages
      .filter((msg) => msg.side === "msg-left")
      .map((msg) => msg.id);

    const rightIds = messages
      .filter((msg) => msg.side === "msg-right")
      .map((msg) => msg.id);

    setSelectedLeft(leftIds);
    setSelectedRight(rightIds);
    setShowSelectMode(true);
    setCheckboxVisible(true);
    setShowMenu(false);
  };

  const handleExitSelectMode = () => {
    setShowSelectMode(false);
    setCheckboxVisible(false);
    setSelectedLeft([]);
    setSelectedRight([]);
  };

  useEffect(() => {
    if (selectedLeft.length === 0 && selectedRight.length === 0) {
      setCheckboxVisible(false);
      if (showSelectMode) {
        // Don't automatically exit select mode when no messages are selected
        // This allows users to enter select mode and then choose messages
        // setShowSelectMode(false);
      }
    }
  }, [selectedLeft, selectedRight, showSelectMode]);

  useEffect(() => {
    fetchChatMembersForUI(setChatMembers);
  }, [reloadChatMembers]);

  useEffect(() => {
    handleChat(
      targetUserId,
      chatMembers,
      setActiveFriend,
      setMessages,
      setChatMembers,
      userId
    );
  }, [targetUserId, chatMembers]);

  useEffect(() => {
    if (!userId || !activeFriend?._id) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      username: user.username,
      userId,
      targetUserId: activeFriend._id,
    });

    socket.on("messageReceived", ({ _id, username, text, timestamp }) => {
      const side = username === user.username ? "msg-right" : "msg-left";
      setMessages((prev) => [
        ...prev,
        { id: _id, side, text, timestamp, username },
      ]);
    });

    socket.on("typing", () => {
      setIsFriendTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(
        () => setIsFriendTyping(false),
        2000
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, activeFriend?._id]);

  const filteredFriends = chatMembers.filter((f) =>
    f?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (targetUserId) {
      setShowChat(true);
      setInitialLoad(false);
    } else if (isMobileView) {
      setShowChat(false);
    }
  }, [targetUserId, isMobileView]);

  return (
    <div className="chat-wrapper">
      <div
        className={`chat-sidebar ${isMobileView && showChat ? "hidden" : ""}`}
      >
        <ChatFriendsList
          filteredFriends={filteredFriends}
          targetUserId={targetUserId}
          setActiveFriend={setActiveFriend}
          setMessages={setMessages}
          setSelectedLeft={setSelectedLeft}
          setSelectedRight={setSelectedRight}
          setCheckboxVisible={setCheckboxVisible}
          setSearchQuery={setSearchQuery}
          handlePlusIconClick={handlePlusIconClick}
          handleClearChat={handleClearChat}
          handleDeleteChat={handleDeleteChat}
        />
      </div>
      {!initialLoad || targetUserId ? (
        <div
          className={`chat-main ${isMobileView && showChat ? "active" : ""}`}
        >
          <ChatHeader
            {...{
              activeFriend,
              checkboxVisible,
              handleChatdelete: () => {
                setConfirmationType("deleteMessages");
                setShowConfirmation(true);
              },
              showMenu,
              setShowMenu,
              handleClearChat,
              handleSelectMessages,
              handleSelectAll,
              showSelectMode,
              handleExitSelectMode,
              handleDeleteChat,
            }}
          />
          <ChatMessages
            {...{
              messages,
              user,
              selectedLeft,
              selectedRight,
              checkboxVisible,
              handleSelectToggle,
              isFriendTyping,
              activeFriend,
              showSelectMode,
            }}
          />
          <ChatInput
            {...{
              sendMessage,
              activeFriend,
              user,
              socketRef,
              typingTimeoutRef,
            }}
          />
        </div>
      ) : (
        <EmptyChat
          handlePlusIconClick={handlePlusIconClick}
          userId={userId}
          user={user}
        />
      )}

      {/* Following List Modal - Now available in all views */}
      {showFollowingList && (
        <div className="following-list-modal">
          <div className="following-list-content">
            <div className="following-header">
              <div className="following-title">Start a new conversation</div>
              <button
                className="close-following-btn"
                onClick={() => setShowFollowingList(false)}
              >
                &times;
              </button>
            </div>
            <div className="following-users">
              {isLoading ? (
                <div className="loading-spinner">Loading...</div>
              ) : followingUsers && followingUsers.length > 0 ? (
                followingUsers.map((followingUser) => (
                  <div
                    key={followingUser._id}
                    className="following-user-item"
                    onClick={() => startNewChat(followingUser)}
                  >
                    <div className="following-user-avatar">
                      {followingUser.profilePicture ? (
                        <img
                          src={followingUser.profilePicture}
                          alt={followingUser.username}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {followingUser.username
                            ? followingUser.username.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                    <div className="following-user-info">
                      <div className="following-user-name">
                        {followingUser.username || "Unknown User"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-following">
                  <p>You are not following anyone yet.</p>
                  <p className="debug-info">
                    User ID: {userId || "Not available"}
                    <br />
                    Following array:{" "}
                    {user?.following
                      ? `${user.following.length} users`
                      : "Not available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3 className="confirmation-title">
              {confirmationType === "clearChat"
                ? "Clear Chat"
                : confirmationType === "deleteMessages"
                ? "Delete Selected Messages"
                : "Delete Chat"}
            </h3>
            <p>
              {confirmationType === "clearChat"
                ? "Are you sure you want to clear all messages? This action cannot be undone."
                : confirmationType === "deleteMessages"
                ? "Are you sure you want to delete the selected messages? This action cannot be undone."
                : "Are you sure you want to delete this chat? This will remove the entire conversation and cannot be undone."}
            </p>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={handleCancelConfirmation}>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={
                  confirmationType === "clearChat"
                    ? handleConfirmClearChat
                    : confirmationType === "deleteMessages"
                    ? handleConfirmDeleteMessages
                    : handleConfirmDeleteChat
                }
              >
                {confirmationType === "clearChat"
                  ? "Clear"
                  : confirmationType === "deleteMessages"
                  ? "Delete"
                  : "Delete Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;