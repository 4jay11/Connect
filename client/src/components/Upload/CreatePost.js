import React from 'react';
import { useSelector } from 'react-redux';
import './CreatePost.css';
const CreatePost = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <form action="" className="create-post">
      <div className="profile-photo">
        <img src={user?.profilePicture} alt="Profile" />
      </div>
      <input type="text" placeholder="What's on your mind?" id="create-post" />
      <input type="submit" value="Post" className="btn btn-primary" />
    </form>
  );
};

export default CreatePost;
