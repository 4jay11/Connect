import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../config/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import "./Chat.css";
import { useNavigate, useParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatFriendsList from "./ChatFriendList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const navigate = useNavigate();
  const { targetUserId } = useParams();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showChat, setShowChat] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFriend, setActiveFriend] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const [reloadChatMembers, setReloadChatMembers] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);
  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleClearChat = () => {
    setShowMenu(false);
  };
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handledelete = async (id) => {
    const deleteForEveryone = selectedLeft.length === 0;

    try {
      const response = await axios.delete(`${BASE_URL}/deleteChats/${id}`, {
        withCredentials: true,
        data: {
          messageIds: [...selectedLeft, ...selectedRight],
          deleteForEveryone,
        },
      });

      // Just remove from local state without re-fetching all messages
      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg) => ![...selectedLeft, ...selectedRight].includes(msg.id)
        )
      );

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

  useEffect(() => {
    if (selectedLeft.length === 0 && selectedRight.length === 0) {
      setCheckboxVisible(false);
    }
  }, [selectedLeft, selectedRight]);

  const fetchChatMembers = async () => {
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

  const fetchChatMessages = async (targetUserId) => {
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

  useEffect(() => {
    fetchChatMembers();
  }, [reloadChatMembers]);

  useEffect(() => {
    const handleChat = async () => {
      if (targetUserId && chatMembers.length >= 0) {
        const friend = chatMembers.find(
          (member) => member._id === targetUserId
        );

        if (friend) {
          setActiveFriend(friend);
          fetchChatMessages(friend._id);
        } else {
          const chat = await fetchChatMessages(targetUserId);

          // Extract the participant
          const otherUser = chat?.participants?.find(
            (user) => user._id !== userId
          );

          if (otherUser) {
            setChatMembers((prev) => [...prev, otherUser]);
            setActiveFriend(otherUser);
          }
        }
      }
    };

    handleChat();
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
      socket.disconnect(); // ✅ Clean up on unmount or re-run
    };
  }, [userId, activeFriend?._id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const timestamp = new Date().toISOString();

    socketRef.current?.emit("sendMessage", {
      username: user.username,
      userId,
      targetUserId: activeFriend._id,
      text: newMessage,
      timestamp,
    });

    setNewMessage("");
    setTyping(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socketRef.current?.emit("typing", {
        userId,
        targetUserId: activeFriend._id,
      });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1000);
  };

  const filteredFriends = chatMembers.filter((f) =>
    f?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {/* <ChatSidebar /> */}
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
      {(!initialLoad || targetUserId) && (
        <div
          className={`chat-main ${isMobileView && showChat ? "active" : ""}`}
        >
          <ChatHeader
            {...{
              activeFriend,
              checkboxVisible,
              handledelete,
              showMenu,
              setShowMenu,
              handleClearChat,
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
          <ChatInput {...{ newMessage, handleTyping, sendMessage }} />
        </div>
      )}
    </div>
  );
};

export default Chat;