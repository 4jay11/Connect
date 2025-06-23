import React, { useEffect, useState } from "react";
import axios from "axios";
import FeedShimmer from "../ShimmerUI/FeedShimmer";
import { formatDistanceToNow, parseISO } from "date-fns";
import "./Feeds.css";
import FeedCard from "./FeedCard";

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/post/post-generator",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(res.data);

        setPosts(res.data);
        if (res.data.length >= 0) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching posts:", err.message);
      }
    };
    fetchPosts();
  }, [refreshTrigger]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/post-reaction/like/${postId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status === 200) setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/post-reaction/bookmark/${postId}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status === 200 || res.status === 201)
        setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <div className="feeds">
      {loading ? (
        <FeedShimmer />
      ) : posts.length > 0 && !loading ? (
        posts.map((post) => (
          <FeedCard
            key={post._id}
            user_id={post?.userId?._id || ""}
            post_id={post._id}
            profilePhoto={post?.userId?.profilePicture || ""}
            username={post?.userId?.username || "Unknown User"}
            location={post.location || "Unknown Location"}
            timeAgo={formatDistanceToNow(parseISO(post.createdAt), {
              addSuffix: true,
            })}
            feedPhoto={post.image || ""}
            likedBy={post.likes || []}
            bookmarkBy={post.bookmarks || []}
            caption={post.content || "No caption"}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Feeds;