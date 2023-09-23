import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import accountModel from "../../models/account";
import postModel from "../../models/post";

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

//

export default async function likeHandler(req, res) {
  const requestBody = req.body;
  const {
    query: { "post-id": postId },
  } = req;
  console.log("handling un-like for:", requestBody);
  connectToDatabase();

  const decodedToken = jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.JWT_SECRET_KEY
  );

  const user = await accountModel.findById(decodedToken.id).exec();
  //create propert, incase it doesent alredy exist
  if (!user.likes) {
    user.likes = [];
  }
  //convert ObjectIds inside user.likes to string
  user.dislikes = user.dislikes.map((id) => id.toString());
  user.likes = user.dislikes.map((id) => id.toString());

  if (user.likes.includes(postId)) {
    user.likes = user.likes.filter((item) => item !== postId);
  }
  await user.save();

  res.status(200).send("bruh");
  console.log("Handled!");
}
