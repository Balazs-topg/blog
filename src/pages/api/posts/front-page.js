import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import postModel from "../models/post";
import accountModel from "../models/account";

let isConnected;
const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
  console.log("Creating new database connection");
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = db.connections[0].readyState;
};

export default async function loginHandler(req, res) {
  const requestBody = req.body;
  console.log("handling frint-page for:", requestBody);
  connectToDatabase();

  let allPosts = await postModel.find({}).lean();
  let count = 0;
  allPosts = await Promise.all(
    allPosts.map(async (post) => {
      const authorDocument = await accountModel.findById(post.author);
      post.author = authorDocument ? authorDocument.username : "Unknown";
      return post;
    })
  );

  // Respond to client
  console.log("Responding with:", allPosts);
  res.status(200).send(allPosts);
  console.log("Handled!");
}
