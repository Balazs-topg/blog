import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import accountModel from "../../models/account";
import postModel from "../../models/post";

config();

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

const handleLike = (user, postIdString, posts) => {
  if (user.dislikes.map((id) => String(id)).includes(postIdString)) {
    posts.numberOfDislikes--;
  }
  if (!user.likes.map((id) => String(id)).includes(postIdString)) {
    user.likes.push(postIdString);
    posts.numberOfLikes++;
  }
  user.dislikes = user.dislikes.filter((item) => String(item) !== postIdString);
};

const handleUnLike = (user, postIdString, posts) => {
  if (user.likes.map((id) => String(id)).includes(postIdString)) {
    posts.numberOfLikes--;
  }
  user.likes = user.likes.filter((item) => String(item) !== postIdString);
};

const handleDislike = (user, postIdString, posts) => {
  if (user.likes.map((id) => String(id)).includes(postIdString)) {
    posts.numberOfLikes--;
  }
  if (!user.dislikes.map((id) => String(id)).includes(postIdString)) {
    user.dislikes.push(postIdString);
    posts.numberOfDislikes++;
  }
  user.likes = user.likes.filter((item) => String(item) !== postIdString);
};

const handleUnDislike = (user, postIdString, posts) => {
  if (user.dislikes.map((id) => String(id)).includes(postIdString)) {
    posts.numberOfDislikes--;
  }

  user.dislikes = user.dislikes.filter((item) => String(item) !== postIdString);
};

export default async function likeHandler(req, res) {
  const {
    body: requestBody,
    query: { "post-id": postId, "like-dislike": actionType },
  } = req;
  const postIdString = String(postId);

  console.log("Handling:", actionType, "for post:", postId);

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  await connectToDatabase();
  const user = await accountModel.findById(decodedToken.id).exec();
  const posts = await postModel.findById(postIdString).exec();

  switch (actionType) {
    case "like":
      handleLike(user, postIdString, posts);
      break;
    case "un-like":
      handleUnLike(user, postIdString, posts);
      break;
    case "dislike":
      handleDislike(user, postIdString, posts);
      break;
    case "un-dislike":
      handleUnDislike(user, postIdString, posts);
      break;
    default:
      console.error("Invalid action:", actionType, posts);
  }

  await user.save();
  await posts.save();
  res.status(200).send("Action handled successfully!");
  console.log("Handled!");
}
