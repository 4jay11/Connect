import React, { useState, useEffect } from "react";
import "./ProfileSection.css";
import {
  UilEdit,
  UilFileAlt,
  UilUserPlus,
  UilUsersAlt,
} from "@iconscout/react-unicons";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateFollowing } from "../../redux/Slices/authSlice";


const ProfileCard = ({ currentUser, posts }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // check if current logged-in user is already following the profile user
  const isFollowing = user?.following?.includes(id);
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing);
  }, [currentUser, user]);

  const handleMessage = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/connection/request/${currentUser._id}`,
        {}, 
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200 || response.status == 201) {
        setFollowing((prev) => !prev);
        dispatch(updateFollowing(currentUser._id));
      }
      console.log("Connection Request Sent:", response.data);
    } catch (error) {
      console.error(
        "Error sending connection request:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = () => {
    navigate("/profile");
  };

  const {
    username = "Unknown",
    bio = "No bio available",
    profilePicture = "",
  } = currentUser || {};

  return (
    <div className="profile-card">
      <div className="image">
        <img src={profilePicture} alt="profile" className="profile-img" />
      </div>
      <div className="text-data">
        <span className="idd text-muted">
          {username}{" "}
          {id === user?._id && <UilEdit className="id" onClick={handleEdit} />}
        </span>
        <span className="name">{username}</span>
        <span className="oneline">{bio}</span>
      </div>

      {id !== user?._id && (
        <div className="buttons">
          <button className="button" onClick={() => handleMessage(id)}>
            Message
          </button>
          <button className="button" onClick={handleFollow}>
            {following ? "Following" : "Follow"}
          </button>
        </div>
      )}

      <div className="stats">
        <div className="data">
          <i>
            <UilFileAlt />
          </i>
          <span>{posts?.length || 0}</span>
        </div>
        <div className="data">
          <i>
            <UilUserPlus />
          </i>
          <span>{currentUser?.following?.length || 0}</span>
        </div>
        <div className="data">
          <i>
            <UilUsersAlt />
          </i>
          <span>{currentUser?.followers?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
