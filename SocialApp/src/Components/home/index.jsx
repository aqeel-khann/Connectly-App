import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const Home = () => {
  const [postList, setPostList] = useState([]);
  const [tokenValue, setTokenValue] = useState([]);
  const [commentBox, setCommentBox] = useState(false);
  const [comentValue, setComentValue] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentReplyCommentId, setCurrentReplyCommentId] = useState(null); // Track current comment for reply
  const [replyValue, setReplyValue] = useState("");

  const fetchPosts = async () => {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log("response is", responseData);
      setPostList(responseData.posts);
      setTokenValue(responseData.token);
    } else {
      alert("Posts are Not Available");
    }
  };

  const socket = io.connect("http://localhost:3000");

  //handle Likes

  const handleLike = (postId, likeUserId) => {
    // console.log("LikeuserId ",likeuserId);
    // console.log("PostId ",postId);
    socket.emit("like", { postId, likeUserId });
  };

  // Handle Comments

  const handleCommentBox = (postId) => {
    setCommentBox(!commentBox);
    setCurrentPostId(postId); // Set the current postId for which comments are being displayed
  };

  const handleComment = (postId, content, userId, username, e) => {
    e.preventDefault();
    socket.emit("coment", { postId, content, userId, username });
    setCommentBox(!commentBox);
    setComentValue("");
  };

  // Handle Reply
  const handleReply = (postId, commentId, userId, content, username, e) => {
    e.preventDefault();
    console.log("postid", postId);
    console.log("commentId", commentId);
    console.log("userId", userId);
    console.log("content", content);
    socket.emit("reply", { postId, commentId, userId, content, username });
    setReplyValue("");
    setCurrentReplyCommentId(null);
  };

  // Socket Events

  useEffect(() => {
     socket.on("likeUpdate", (updatedPost) => {
       // Find the index of the updated post in postList
       const updatedIndex = postList.findIndex(
         (post) => post._id === updatedPost._id
       );
       if (updatedIndex !== -1) {
         // Update the post with the new data
         const updatedPosts = [...postList];
         updatedPosts[updatedIndex] = updatedPost;
         setPostList(updatedPosts);
       }
     });



    socket.on("commentUpdate", (updatedPost) => {
      const updatedIndex = postList.findIndex(
        (post) => post._id === updatedPost._id
      );
      if (updatedIndex !== -1) {
        const updatedPosts = [...postList];
        updatedPosts[updatedIndex] = updatedPost;
        setPostList(updatedPosts);
      }
    });
  }, [socket, postList]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div>
        <p className="mx-2 my-10">Dashboard</p>
        {postList.map((post, index) => (
          <div key={index} className="mb-2">
            <p className="mx-2">@{post.userId.name}</p>
            <textarea
              name="content"
              id="content"
              className="w-96 h-20 p-2 mx-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              value={post.content}
              readOnly
            ></textarea>
            <br />
            <span
              onClick={() => handleLike(post._id, tokenValue.userId)}
              className="px-3"
            >
              like ({post.likes.length})
            </span>
            <span onClick={() => handleCommentBox(post._id)} className="px-3">
              comment({post.comments.length})
            </span>

            {commentBox && currentPostId === post._id && (
              <div className="w-2/4 p-2 mx-2 mt-2 rounded-lg">
                <div className="mb-2">
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex items-center">
                        <p className="font-bold">@{comment.username}:</p>
                        <p className="ml-2">{comment.content}</p>
                        <button
                          onClick={() =>
                            setCurrentReplyCommentId(
                              currentReplyCommentId === comment._id
                                ? null
                                : comment._id
                            )
                          }
                          className="ml-2 text-blue-500"
                        >
                          Reply
                        </button>
                      </div>

                      {currentReplyCommentId === comment._id && (
                        <div className="ml-8 mt-2">
                          <textarea
                            onChange={(e) => setReplyValue(e.target.value)}
                            value={replyValue}
                            className="w-full h-16 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Write a reply..."
                          ></textarea>
                          <br />
                          <button
                            onClick={(e) =>
                              handleReply(
                                post._id,
                                comment._id,
                                tokenValue.userId,
                                replyValue,
                                tokenValue.name,

                                e
                              )
                            }
                            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg"
                            type="submit"
                          >
                            Post Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <textarea
                  onChange={(e) => setComentValue(e.target.value)}
                  value={comentValue}
                  className="w-96 h-16 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Write a comment..."
                ></textarea>
                <br />
                <button
                  onClick={(e) =>
                    handleComment(
                      post._id,
                      comentValue,
                      tokenValue.userId,
                      tokenValue.name,
                      e
                    )
                  }
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg"
                  type="submit"
                >
                  Post Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
