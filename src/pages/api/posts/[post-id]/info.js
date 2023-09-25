import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import postModel from "../../models/post";
import accountModel from "../../models/account";

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

export default async function infoHandler(req, res) {
  const requestBody = req.body;
  const {
    query: { "post-id": postId },
  } = req;
  const postIdString = String(postId);

  console.log("handling info for:", postIdString);
  connectToDatabase();

  let post = await postModel.findById(postIdString);
  post = post.toObject();

  let account = await accountModel.findById(String(post.author));
  post.authorUsername = account.username;

  // Respond to client
  console.log("Responding with:", post);
  res.status(200).send(post);
  console.log("Handled!");
}
