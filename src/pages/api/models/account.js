import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // if they are IDs of posts
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // same here
  },
  {
    versionKey: false,
    strict: false,
  }
);

const accountModel =
  mongoose.models.accounts || mongoose.model("accounts", accountSchema);

export default accountModel;
