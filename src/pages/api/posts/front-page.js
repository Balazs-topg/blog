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

export default async function frontPageHandler(req, res) {
  const requestBody = req.body;
  console.log("handling frint-page for:", requestBody);
  connectToDatabase();

  let allPosts = await postModel.find({}).lean();
  allPosts = await Promise.all(
    allPosts.map(async (post) => {
      const authorDocument = await accountModel.findById(post.author);
      post.author = authorDocument ? authorDocument.username : "Unknown";
      return post;
    })
  );

  //decode jwt
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedJwt.id;

    const account = await accountModel.findById(userId);

    allPosts.map((post) => {
      if (account.likes.includes(String(post._id))) {
        post.liked = true;
        return post;
      } else {
        post.liked = false;
      }
    });
    allPosts.map((post) => {
      if (account.dislikes.includes(String(post._id))) {
        post.disliked = true;
        return post;
      } else {
        post.disliked = false;
      }
    });
  } catch {}

  // Respond to client
  console.log("Responding with:", allPosts.reverse());
  res.status(200).send(allPosts);
  console.log("Handled!");
}
