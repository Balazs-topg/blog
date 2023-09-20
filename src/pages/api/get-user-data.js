import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

// database stuffs
const accountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);
const accountModel =
  mongoose.models.accounts || mongoose.model("accounts", accountSchema);

export default async function handler(req, res) {
  const requestBody = req.body;
  console.log("handeling get-user-data for: ", requestBody);

  let responseMessageToClient = {
    status: undefined,
    username: undefined,
    email: undefined,
  };

  //decode jwt
  const decodedJwt = jwt.verify(requestBody.jwt, process.env.JWT_SECRET_KEY);
  console.log("decoded: ", decodedJwt.id);

  await accountModel
    .findById(decodedJwt.id)
    .then((user) => {
      console.log("usereeee: ", user);
      if (user) {
        responseMessageToClient.status = 200;
        responseMessageToClient.username = user.username;
        responseMessageToClient.email = user.email;
      } else {
        console.log("No user found with that ID");
      }
    })
    .catch((error) => {
      console.error("Error finding user", error);
    });

  //respond to client
  console.log("responding with: ", responseMessageToClient);
  res.status(responseMessageToClient.status).send(responseMessageToClient);
  console.log("handeled!");
}
