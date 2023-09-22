import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import accountModel from "./models/account";

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
  console.log("handling login for:", requestBody);
  connectToDatabase();

  let responseMessageToClient = {
    status: undefined,
    message: undefined,
    username: undefined,
    jwt: null,
    loginSuccessful: false,
  };

  // Check if email exists and get username if it does
  const user = await accountModel.findOne({ email: requestBody.email });
  if (!user) {
    responseMessageToClient.status = 401; // Unauthorized
    responseMessageToClient.message = "Invalid email or password";
  } else {
    responseMessageToClient.username = user.username;
  }

  // Check password
  if (!responseMessageToClient.status) {
    const isPasswordCorrect = await bcrypt.compare(
      requestBody.password,
      user.password
    );
    if (!isPasswordCorrect) {
      responseMessageToClient.status = 401; // Unauthorized
      responseMessageToClient.message = "Invalid email or password";
    }
  }

  // Generate JWT
  if (!responseMessageToClient.status) {
    responseMessageToClient.jwt = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "28d" }
    );
    responseMessageToClient.loginSuccessful = true;
    responseMessageToClient.status = 200;
  }
  // Respond to client
  console.log("Responding with:", responseMessageToClient);
  res.status(200).send(responseMessageToClient);
  console.log("Handled!");
}
