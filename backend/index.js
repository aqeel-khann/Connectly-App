const express = require("express");
const app = express();
const connectDB = require("./db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { Authenticate } = require("./middleware/auth");
const { createUser, loginUser } = require("./controllers/users");
const {
  uploadePost,
  getPost,
  DeletePost,
  updatePost,
  allPosts,
 
} = require("./controllers/post");
const Post = require("./models/post");
const mongoose=require("mongoose");
const { log } = require("console");
 

//Port
const port = process.env | 3000;

//http server sockets
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",  
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// tackle cors
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PATCH, PUT, DELETE, HEAD",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

//Database Connection
connectDB();

//userCreation
app.post("/signup", createUser);
app.post("/login", loginUser);

//create
app.post("/post", Authenticate, uploadePost);
//read
app.get("/post", Authenticate, getPost);
//delete
app.delete("/post/deletepost", Authenticate, DeletePost);
//update
app.patch("/post/updatepost", Authenticate, updatePost);
//get All Posts
app.get("/",Authenticate, allPosts);

io.on("connection", (socket) => {
  console.log(`User connectd`);

  socket.on("like", async(data) => {
    // console.log("data is ", data);
    const {postId,likeUserId } = data;
    // console.log("postID is ", postId);
    // console.log("LikeUserID is ", likeUserId);
    try {
      const post = await Post.findOne({ _id: postId });
      // console.log("Our Post is ", post);
      const findLike = post.likes.includes(likeUserId)
      if (!findLike) {
        post.likes.push(likeUserId)
      } else {
         post.likes = post.likes.filter((id) => id.toString() !== likeUserId);
      }
      await post.save()
      io.emit("likeUpdate", post);
      // console.log("Our Like condition is",findLike);
    } catch (error) {
      console.log("Error while reciving Like",);
      
    }
  });
  


  //comment

  socket.on("coment", async (data) => {
    console.log(data);
    const { postId, content, userId ,username} = data;
    // console.log("postid", postId);
    // console.log("content", content);
    // console.log("userId", userId);
    const post = await Post.findOne({ _id: postId })
    post.comments.push({ userId, content, username })
    await post.save()
    // console.log("post is", post);
    io.emit("commentUpdate",post)
    // Post.comments.push({postId, content, userId});
  });

  //Reply

  socket.on("reply", async (data) => {
    const { postId, commentId, userId, content, username } = data;
    const post = await Post.findOne({ _id: postId });
    const commentPost = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    commentPost.replies.push({ user: userId, text: content, username });
    await post.save();
    io.emit("replyUpdate", { postId, commentPost });
    // console.log("reply post is", commentPost);
  });







})
 
 

 

 



server.listen(port, () => console.log(`Server is Running on Port ${port}`));