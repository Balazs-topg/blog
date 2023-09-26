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

export default async function commentHandler(req, res) {
  const requestBody = req.body;
  const {
    query: { "post-id": postId },
  } = req;
  const postIdString = String(postId);

  console.log("handling comment for:", postIdString);

  //jwt
  let token, decodedToken, user, userId, userIdString;
  try {
    token = req.headers.authorization.split(" ")[1];
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    user = await accountModel.findById(decodedToken.id).exec();
    userId = user._id;
    userIdString = String(userId);
  } catch {
    res.status(400);
  }
  connectToDatabase();

  // let account = await accountModel.findById(userId).exec();
  // account.save()

  let post = await postModel.findById(postIdString).exec();
  post.comments.push({ message: requestBody.message, author: userId });
  post.save();

  // Respond to client
  console.log("Responding with:", post);
  res.status(200).send(post);
  console.log("Handled!");
}
