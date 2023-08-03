import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Comment = ({ tweetId }) => {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    const fetchComments = async () => {
        try {
          const response = await axios.get(`/tweets/${tweetId}/comments`);
          setComments(response.data);
        } catch (error) {
          console.log("Error retrieving comments:", error);
        }
      };
    
      useEffect(() => {
        fetchComments();
      }, [tweetId]);

    const fetchUser = async (userId) => {
        try {
            const response = await axios.get(`/users/find/${userId}`);
            return response.data;
        } catch (error) {
            console.log("Error retrieving user:", error);
            return null;
        }
    };

    const fetchCommentUser = async () => {
        const commentsWithUser = await Promise.all(
            comments.map(async (comment) => {
                const user = await fetchUser(comment.userId);
                return { ...comment, user };
            })
        );
        setComments(commentsWithUser);
    };

    useEffect(() => {
        fetchCommentUser();
    }, [comments]);

const handleSubmitComment = async (event) => {
  event.preventDefault();
  console.log("Submitting comment");
  if (commentText.trim() === "") return;

  try {
    await axios.post(`/tweets/${tweetId}/comments`, {
      comment: commentText,
      userId: currentUser._id,
    });

    // After posting the comment, fetch updated comments again
    fetchComments();

    setCommentText(""); // Clear the comment text after adding the comment
  } catch (error) {
    console.log("Error adding comment:", error);
  }
};






    

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmitComment}>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                />
                <button type="submit">Post</button>
            </form>
            {comments &&
                comments.map((comment) => (
                    <div key={comment._id}>
                        <p>
                            {comment.user && comment.user.username}: {comment.text}
                        </p>
                    </div>
                ))}
        </div>
    );
};

export default Comment;