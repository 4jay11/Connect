import React, { useEffect, useState } from "react";
import Cards from "../Card/Cards";
import { getHighlights } from "../../services/highlights";
import { useParams } from "react-router-dom";

export const Highlights = () => {
  const [normalizedStories, setNormalizedStories] = useState([]);
  const { userId } = useParams();

useEffect(() => {
  const fetchHighlights = async () => {
    try {
      const response = await getHighlights(userId);
      console.log("Raw Highlights:", response);

      if (!Array.isArray(response)) {
        console.warn("Expected an array from getHighlights");
        return;
      }

      const transformed = response.flatMap((highlight) => {
        const highlightName = highlight.name;
        const userId = highlight.userId;
        const highlightId = highlight._id;


        if (!Array.isArray(highlight.stories) || highlight.stories.length === 0)
          return [];

        return highlight.stories.map((story) => ({
          highlightId: highlightId,
          storyId: story._id, 
          _id: userId, 
          content: story.content,
          image: story.image,
          createdAt: story.createdAt,
          userId: {
            _id: story.userId?._id || "",
            username: story.userId?.username || highlightName || "Unknown",
            profilePicture:
              story.userId?.profilePicture ||
              story.image ||
              "/default-avatar.png",
          },
        }));

      });

      console.log("Transformed:", transformed);
      setNormalizedStories(transformed);
    } catch (error) {
      console.error("Error fetching highlights:", error);
    }
  };

  fetchHighlights();
}, [userId]);


  return (
    <Cards data={normalizedStories} route="highlights" cardType="highlight" />
  );
};
