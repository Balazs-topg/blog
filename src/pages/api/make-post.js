import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import postModel from "./models/post";
import accountModel from "./models/account";

export default async function handler(req, res) {
  const requestBody = req.body;
  console.log("handeling make-post for: ", requestBody);

  //catch empty bodies
  if (
    requestBody.message === undefined ||
    requestBody.message === "" ||
    requestBody.title === undefined ||
    requestBody.title === ""
  ) {
    res.status(500);
  }

  //init response message
  let responseMessageToClient = {
    status: undefined,
    message: undefined,
    usernameIsTaken: false,
    PostSuccessfull: false,
  };

  //init internalRequestStatus (we don't want to share these with the frontend client for security reasons)
  let internalRequestStatus = {
    databaseConnectionFail: undefined,
    databaseAppendFail: undefined,
  };

  //decode jwt
  const token = req.headers.authorization.split(" ")[1];
  const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decodedJwt.id;

  //database connect
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    internalRequestStatus.databaseConnectionFail = false;
  } catch (error) {
    internalRequestStatus.databaseConnectionFail = true;
    responseMessageToClient.error = 500;
  }

  //add to database
  try {
    const postDataToModel = new postModel({
      author: userId,
      title: requestBody.title,
      message: requestBody.message,
    });
    await postDataToModel.save();

    responseMessageToClient.SignupSuccessfull = true;
    responseMessageToClient.status = 200;
  } catch (error) {
    internalRequestStatus.databaseAppendFail = true;
    responseMessageToClient.status = 500;
    console.log("error databaseAppendFail: ", error);
  }

  //respond to client
  console.log("responding with: ", responseMessageToClient);
  res.status(responseMessageToClient.status).send(responseMessageToClient);
  console.log("handeled!");
}
