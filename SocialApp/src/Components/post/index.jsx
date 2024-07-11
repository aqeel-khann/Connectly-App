import { useState, useEffect } from "react";

export const Post = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const [postList, setPostList] = useState([]);
  const [editPostId, setEditPostId] = useState(null);

  const handleTextChange = (e) => {
    setNewPostContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editPostId) {
      handleUpdate(editPostId, newPostContent);
    } else {
      createPost();
    }
  };

  const createPost = async () => {
    try {
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (response.status === 201) {
        const responseData = await response.json();
        setPostList((prevPostList) => [
          ...prevPostList,
          {
            _id: responseData.post._id,
            content: newPostContent,
            userId: responseData.post.userId,
          },
        ]);
        setNewPostContent("");
        setEditPostId(null);
        alert("Post Created Successfully");
      } else {
        alert("Error in Post Creation");
      }
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post");
    }
  };

  const handleUpdate = async (postId, content) => {
    try {
      const response = await fetch(`http://localhost:3000/post/updatepost`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        setPostList((prevPostList) =>
          prevPostList.map((post) =>
            post._id === postId ? responseData.post : post
          )
        );
        setNewPostContent("");
        setEditPostId(null);
        alert("Post Updated Successfully");
      } else {
        alert("Error in Post Updation");
      }
    } catch (error) {
      console.error("Error in Post Updation", error);
      alert("Failed to update post");
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/post", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        if (responseData.status) {
          setPostList(responseData.posts);
        } else {
          alert("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
        alert("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, []);

  const startEdit = (post) => {
    setNewPostContent(post.content);
    setEditPostId(post._id);
  };


  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/post/deletepost`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });
      

      if (response.status === 200) {
        alert("Post Deleted Successfully");
        // Update the post list in the state
        setPostList((prevPostList) =>
          prevPostList.filter((post) => post._id !== postId)
        );
      } else {
        alert("Error in Post Deletion");
      }
    } catch (error) {
      console.error("Error in Post Deletion", error);
      alert("Failed to delete post");
    }
  };

  return (
    <>
      <p className="mx-4">@</p>
      <form onSubmit={handleSubmit}>
        <div className="mx-4 mb-2">
          <textarea
            onChange={handleTextChange}
            value={newPostContent}
            name="content"
            id="content"
            className="w-96 h-20 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Write your post here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 mx-4 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {editPostId ? "Update Post" : "Create Post"}
        </button>
      </form>

      <div>
        <p className="mx-2 my-10">Your Posts</p>
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
            <button
              onClick={() => startEdit(post)}
              className="bg-blue-500 mx-2 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post._id)}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
