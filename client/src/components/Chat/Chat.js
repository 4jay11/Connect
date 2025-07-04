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
import SidebarNav from "../Sidebar/SidebarNav";
import "./Chat.css";

import { fetchChatMessages, fetchChatMembersForUI } from "../../utils/fetch";
import { fetchChatMembers } from "../../services/chatApi";
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
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFriend, setActiveFriend] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
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
  const [processingUserId, setProcessingUserId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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

  const handleDeleteChat = async (targetId) => {
    console.log("handleDeleteChat");
    deleteChat(targetId);
    setChatMembers((prev) => prev.filter((member) => member._id !== targetId));
    setActiveFriend(null);
    setShowEmptyChat(true);
    setMessages([]);
  };

  const handleConfirmDeleteChat = async () => {
    console.log("handleConfirmDeleteChat");
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
    console.log("handleClearChat");
  };

  const handleConfirmClearChat = async () => {
    console.log("handleConfirmClearChat");
  };

  const handleConfirmDeleteMessages = () => {
    handleChatdelete(activeFriend?._id);
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const fetchFollowingUsers = async () => {
    setIsLoading(true);
    try {
      if (!user?.following || user.following.length === 0) {
        console.log("No following users found in Redux state");
        setFollowingUsers([]);
        setIsLoading(false);
        return;
      }

      console.log("Fetching following users...");
      const followingData = await Promise.all(
        user.following.map(async (followingId) => {
          if (!followingId) return null;

          try {
            const userData = await getUserProfile(followingId);

            // Check for different possible response structures
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

      console.log(`Found ${validUsers.length} following users`);
      setFollowingUsers(validUsers);
    } catch (error) {
      console.error("Error fetching following users:", error);
      setFollowingUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlusIconClick = () => {
    // Fetching following users if not already fetched
    setShowFollowingList(true);
    if (!followingUsers || followingUsers.length === 0) {
      fetchFollowingUsers();
    }
  };

  const startNewChat = async (selectedUser) => {
    console.log("startNewChat");
    navigate(`/chat/${selectedUser._id}`);
    setActiveFriend(selectedUser);
    setShowEmptyChat(false);
    setMessages([]);
    if (!chatMembers.some((member) => member._id === selectedUser._id)) {
      setChatMembers([...chatMembers, selectedUser]);
    }
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
    // If select left or right is updated or change in displaying select mode
    if (selectedLeft.length === 0 && selectedRight.length === 0) {
      setCheckboxVisible(false);
    }
  }, [selectedLeft, selectedRight, showSelectMode]);

  // Fetching chat messages when active friend changes
  useEffect(() => {
    handleChat(
      targetUserId,
      chatMembers,
      setActiveFriend,
      setMessages,
      setChatMembers,
      userId
    );
  }, [activeFriend]);

  // WebSocket connection for chat messages
  useEffect(() => {
    // TODO:Chat delete updation via socket
    // TODO:Once message is sent , typing indicator should be removed
    if (!activeFriend?._id) return;

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
  }, [activeFriend?._id]);

  const filteredFriends = chatMembers.filter((f) =>
    f?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch Chat Member once component mounts
  useEffect(() => {
    fetchChatMembersForUI(setChatMembers);
  }, []);

  return (
    <div className="chat-wrapper">
      <SidebarNav showSocialName={true} />
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
          setShowEmptyChat={setShowEmptyChat}
        />
      </div>
      {!showEmptyChat ? (
        <div
          className={`chat-main ${isMobileView && showChat ? "active" : ""}`}
        >
          <ChatHeader
            {...{
              activeFriend,
              checkboxVisible,
              handleChatdelete: () => {
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
                onClick={() =>
                  processingUserId ? null : setShowFollowingList(false)
                }
                disabled={processingUserId !== null}
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
                    className={`following-user-item ${
                      processingUserId && processingUserId !== followingUser._id
                        ? "disabled"
                        : ""
                    } ${
                      processingUserId === followingUser._id ? "processing" : ""
                    }`}
                    onClick={() => {
                      console.log(
                        "User selected from following list:",
                        followingUser
                      );
                      startNewChat(followingUser);
                    }}
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
                    {processingUserId === followingUser._id && (
                      <div className="user-loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    )}
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

      {/* Toast Notification */}
      {toast.show && (
        <div className={`chat-toast ${toast.type}`}>
          <div className="toast-content">
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;