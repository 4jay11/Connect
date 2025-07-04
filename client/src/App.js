import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Stories from "./components/Story/Stories";

import Posts from "./components/Post/Posts";
import FriendRequests from "./components/FriendRequest/FriendRequests";

import "./App.css";
const App = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleUpload = () => {
    navigate("/upload");
  };
  return (
    <div className="App">
      <Navbar currentUser={currentUser} />
      <main>
        <div className="container">
          <div className="left">
            <Sidebar currentUser={currentUser} />
            <label
              onClick={handleUpload}
              htmlFor="create-post"
              className="btn btn-primary"
            >
              Create Post
            </label>
          </div>
          <div className="middle">
            <div className="story">
              <Stories />
            </div>
            {/* <CreatePost /> */}
            <div className="feed">
              <Posts currentUser={currentUser} />
            </div>
          </div>
          <div className="right">
            {/* <Messages /> */}
            <h4>Requests</h4>
            <FriendRequests currentUser={currentUser} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
