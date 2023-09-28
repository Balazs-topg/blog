import mongoose from "mongoose";
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
    query: { username: username },
  } = req;

  console.log("handling account info for:", username);
  connectToDatabase();

  let account = await accountModel.find({ username: username });
  console.log("found this in db", account);

  // let account = await accountModel.findById(String(post.author));
  // post.authorUsername = account.username;

  // Respond to client
  console.log("Responding with:", account);
  res.status(200).send(account);
  console.log("Handled!");
}
