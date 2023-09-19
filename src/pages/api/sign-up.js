import mongoose from "mongoose";
require("dotenv").config();

const accountSignupSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

const accountSignupModel =
  mongoose.models.accounts || mongoose.model("accounts", accountSignupSchema);

export default async function handler(req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mongo!");
  } catch (error) {
    console.error("Failed to connect to mongo", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  const body = req.body;
  console.log("body", body);

  try {
    const signUpDataToModel = new accountSignupModel(body);
    await signUpDataToModel.save();
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Failed to save data", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
