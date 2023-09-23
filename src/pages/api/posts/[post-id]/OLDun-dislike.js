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
  try {
    const requestBody = req.body;
    const {
      query: { "post-id": postIdDynamic },
    } = req;
    const postId = String(postIdDynamic);

    console.log("handling un-dislike for:", requestBody);
    await connectToDatabase();

    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );

    const user = await accountModel.findById(decodedToken.id).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Ensure dislikes array exists
    if (!user.dislikes) {
      user.dislikes = [];
    }

    if (user.dislikes.map((id) => id.toString()).includes(postId)) {
      console.log("removing it ...");
      user.dislikes = user.dislikes.filter((id) => id.toString() !== postId);
      user.markModified("dislikes");
    }

    await user.save();
    res.status(200).send("Handled!");
  } catch (error) {
    console.error("Error handling the request:", error);
    return res.status(500).send("Internal Server Error");
  }
}
