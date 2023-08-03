import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    }
},
    { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;