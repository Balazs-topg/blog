import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    timeOfPost: { type: Date, required: true },
    numberOfLikes: { type: Number, required: true },
    numberOfDislikes: { type: Number, required: true },
  },
  { versionKey: false }
);
const postModel = mongoose.models.posts || mongoose.model("posts", postSchema);

export default postModel;
