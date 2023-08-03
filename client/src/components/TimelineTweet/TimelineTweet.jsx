import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";
import Comment from "../Comment/Comment"

const TimelineTweet = () => {
  const [timeLine, setTimeLine] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineTweets = await axios.get(
          `/tweets/timeline/${currentUser._id}`
        );

        const sortedTweets = timelineTweets.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setTimeLine(sortedTweets);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser._id]);

  const handleAddComment = async (tweetId, commentText) => {
    try {
      const response = await axios.post(`/tweets/${tweetId}/comments`, {
        text: commentText,
        userId: currentUser._id, // Add the userId
        tweetId: tweetId, // Add the tweetId
      });
      const updatedTweet = response.data;
      return updatedTweet;
      // Update the timeline with the new comment
      setTimeLine((prevTimeline) =>
        prevTimeline.map((tweet) =>
          tweet._id === updatedTweet._id ? updatedTweet : tweet
        )
      );
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  const retrieveCommentsForTweet = async (tweetId) => {
    try {
      const response = await axios.get(`/tweets/${tweetId}/comments`);
      return response.data;
    } catch (error) {
      console.log("Error retrieving comments:", error);
      return [];
    }
  };

  //console.log("Timeline", timeLine);
  return (
    <div className="mt-6">
      {timeLine &&
        timeLine.map((tweet) => {
          return (
            <div key={tweet._id} className="p-2">
              <Tweet tweet={tweet} setData={setTimeLine} />
              <Comment
                tweetId={tweet._id}
                handleAddComment={handleAddComment}
                retrieveComments={retrieveCommentsForTweet}
              />
            </div>
          );
        })}
    </div>
  );
};

export default TimelineTweet;