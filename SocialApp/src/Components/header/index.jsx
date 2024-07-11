import React from "react";
import { useNavigate } from "react-router-dom";


export const Header = () => {
    const navigate = useNavigate()
    
    const handleLogin = ()=>{
        navigate("/login")
    }
    const handleSignup = () => {
        navigate("/signup")
  }
  const handleHome = () => {
        navigate("/")
  }
  const handleProfile = () => {
        navigate("/post")
    }
  return (
    <header className="bg-blue-500 text-white p-6 shadow-md flex justify-between items-center">
      <h1 className="text-3xl font-bold">Welcome to App</h1>
      <div className="flex space-x-4">
        <button onClick={handleHome} className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
          Home
        </button><button onClick={handleProfile} className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
          Post
        </button>
        <button onClick={handleLogin} className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
          Login
        </button>
        <button onClick={handleSignup} className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
          SignUp
        </button>
      </div>
    </header>
  );
};
