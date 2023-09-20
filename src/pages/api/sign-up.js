import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
  console.log("handeling signup for: ", requestBody);

  //init response message
  let responseMessageToClient = {
    status: undefined,
    message: undefined,
    usernameIsTaken: undefined,
    emailIsTaken: undefined,
    passwordIsWeak: undefined,
    jwt: undefined,
    SignupSuccessfull: false,
  };

  //init internalRequestStatus (we don't want to share these with the frontend client for security reasons)
  let internalRequestStatus = {
    databaseConnectionFail: undefined,
    databaseAppendFail: undefined,
  };

  //database connect
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    internalRequestStatus.databaseConnectionFail = false;
  } catch (error) {
    internalRequestStatus.databaseConnectionFail = true;
    responseMessageToClient.error = 500;
  }

  //check if username or email is taken
  const isEmailTaken =
    (await accountModel.countDocuments({ email: requestBody.email })) > 0;
  const isUsernameTaken =
    (await accountModel.countDocuments({ username: requestBody.username })) > 0;

  if (isEmailTaken) {
    responseMessageToClient.emailIsTaken = true;
    responseMessageToClient.status = 400;
  }
  if (isUsernameTaken) {
    responseMessageToClient.usernameIsTaken = true;
    responseMessageToClient.status = 400;
  }

  //check if password is weak
  if (requestBody.password.length < 5) {
    responseMessageToClient.passwordIsWeak = true;
    responseMessageToClient.status = 400;
  }

  //add to database
  if (
    !(
      responseMessageToClient.emailIsTaken ||
      responseMessageToClient.usernameIsTaken ||
      responseMessageToClient.passwordIsWeak
    )
  ) {
    try {
      const hashedPassword = await bcrypt.hash(requestBody.password, 10);
      const signUpDataToModel = new accountModel({
        username: requestBody.username,
        email: requestBody.email,
        password: hashedPassword,
      });
      await signUpDataToModel.save();

      responseMessageToClient.SignupSuccessfull = true;
      responseMessageToClient.status = 200;
    } catch (error) {
      internalRequestStatus.databaseAppendFail = true;
      responseMessageToClient.status = 500;
      console.log("error databaseAppendFail: ", error);
    }
  }

  //add jwt
  if (responseMessageToClient.status === 200) {
    await accountModel
      .findOne({ username: requestBody.username })
      .then((user) => {
        responseMessageToClient.jwt = jwt.sign(
          { id: user._id, username: requestBody.username },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "28d" }
        );
      });
  }

  //respond to client
  console.log("responding with: ", responseMessageToClient);
  res.status(responseMessageToClient.status).send(responseMessageToClient);
  console.log("handeled!");
}
