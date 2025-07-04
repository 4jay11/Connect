import React, { useEffect, useState } from "react";
import Cards from "../Card/Cards";
import { getStories } from "../../services/storyApi";
import "./StoryPage.css"; // Make sure you have this CSS file

export const StoryPage = () => {
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      const response = await getStories();
      setStory(response);
    };
    fetchStory();
  }, []);

  return (
    <>
      <Cards data={story} route="story-page" cardType="story" />
    </>
  );
};
