import mongoose from "mongoose";

const userschema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String
        },
        followers: { type: Array, defaultValue: [] },
        following: { type: Array, defaultValue: [] },
        description: { type: String },
    },
    { timestamps: true },
);

export default mongoose.model('user', userschema);