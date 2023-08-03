import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.cjs";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";
//import "./log.js";

const app = express();
dotenv.config();
app.use(express.json())

app.use(cookieParser());
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/tweets',tweetRoutes)

app.listen(7001,()=>{
    connectDB();

    console.log("Listening to port 7001")
});

