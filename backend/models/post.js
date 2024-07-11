// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
//   comments: [
//     {
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       content: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

// const Post = mongoose.model("Post", postSchema);

// module.exports = Post;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const replySchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    username:String,
    content: String,
    replies: [replySchema],
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post=mongoose.model("Post", postSchema);
module.exports = Post;
