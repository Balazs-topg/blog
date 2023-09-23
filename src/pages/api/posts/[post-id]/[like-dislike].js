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

const handleLike = (user, postIdString) => {
  if (!user.likes.map((id) => String(id)).includes(postIdString)) {
    user.likes.push(postIdString);
  }
  user.dislikes = user.dislikes.filter((item) => String(item) !== postIdString);
};

const handleUnLike = (user, postIdString) => {
  user.likes = user.likes.filter((item) => String(item) !== postIdString);
};

const handleDislike = (user, postIdString) => {
  if (!user.dislikes.map((id) => String(id)).includes(postIdString)) {
    user.dislikes.push(postIdString);
  }
  user.likes = user.likes.filter((item) => String(item) !== postIdString);
};

const handleUnDislike = (user, postIdString) => {
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

  switch (actionType) {
    case "like":
      handleLike(user, postIdString);
      break;
    case "un-like":
      handleUnLike(user, postIdString);
      break;
    case "dislike":
      handleDislike(user, postIdString);
      break;
    case "un-dislike":
      handleUnDislike(user, postIdString);
      break;
    default:
      console.error("Invalid action:", actionType);
  }

  await user.save();
  res.status(200).send("Action handled successfully!");
  console.log("Handled!");
}
