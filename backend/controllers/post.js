const Post = require("../models/post");

// create post
const uploadePost = async (req,res) => {
    try {
      const { content } = req.body;
      const uId = req.user.userId
      const post = await Post.create({
          content,
          userId:uId
      });
      res.status(201).json({status: true,response: "Post created successfully",post});
    } catch (error) {
        res.status(400).json({
          status: false,
          response: "Error in Post Creation",
          data: error,
        });
    }

 
};
//read Post
const getPost = async (req, res) => {
  const uId = req.user.userId;
  const allPosts = await Post.find({ userId: uId }).populate("userId", "name");
  res.status(200).json({ status: true, posts: allPosts });
};

//Delet post
const DeletePost = async (req, res) => {
  const uId = req.user.userId
  const deletePost = await Post.findOneAndDelete(uId)
  console.log(deletePost);
  res.status(200).json({ status: true, posts:deletePost });
}

//updatePost

const updatePost = async (req, res) => {
  const { postId, content } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate( postId, { content }, { new: true }).populate("userId", "name");
    if (!updatedPost) {
      return res.status(404).json({ status: false, response: "Post not found" });
    }
    res.status(200).json({ status: true, post: updatedPost });
  } catch (error) {
    console.error("Error in Post Update", error);
    res.status(500).json({ status: false, response: "Error in Post Update" });
  }
};

//read Post
const allPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().populate("userId", "name");
    const data = req.user
    // console.log(data);
    res.status(200).json({ status: true, posts: allPosts,token:data});
  } catch (error) {
    console.error(`Error in fetching posts: ${error}`);
    res.status(500).json({ status: false, error: error.message });
  }
};

 

 



  

    module.exports = {uploadePost,getPost,DeletePost,updatePost,allPosts};

