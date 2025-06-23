import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../config/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatFriendsList from "./ChatFriendList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { FaPlusCircle } from "react-icons/fa";

import "./Chat.css";
import "./EmptyChat.css";

import { fetchChatMessages, fetchChatMembersForUI } from "../../utils/fetch";
import { handleChat } from "../../utils/handle";
import { sendMessage } from "../../utils/post";
import { handledelete } from "../../utils/handle";
import useWindowResize from "../../hooks/useWindowResize";
import { getUserProfile } from "../../services/userApi";

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

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleChatdelete = async (id) => {
    try {
      handledelete(id, selectedLeft, selectedRight, setMessages);
      setSelectedLeft([]);
      setSelectedRight([]);
    } catch (error) {
      console.error("Error deleting chats:", error);
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

  useEffect(() => {
    if (selectedLeft.length === 0 && selectedRight.length === 0) {
      setCheckboxVisible(false);
    }
  }, [selectedLeft, selectedRight]);

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
          {...{
            filteredFriends,
            targetUserId,
            setActiveFriend,
            setSearchQuery,
            setMessages,
            setSelectedLeft,
            setSelectedRight,
            setCheckboxVisible,
          }}
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
              handleChatdelete,
              showMenu,
              setShowMenu,
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
        <div className="empty-chat">
          <FaPlusCircle className="plus-icon" onClick={handlePlusIconClick} />
          <h3>No chat selected</h3>
          <p>Select a conversation or start a new one</p>

          {showFollowingList && (
            <div className="following-list-modal">
              <div className="following-list-content">
                <div className="following-header">
                  <h3>Start a new conversation</h3>
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
                          <h4>{followingUser.username || "Unknown User"}</h4>
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
        </div>
      )}
    </div>
  );
};

export default Chat;