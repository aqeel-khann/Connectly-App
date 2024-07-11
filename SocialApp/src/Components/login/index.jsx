import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    
  const [user, setUser] = useState({ email: "", password: "" });
  
  
  const navigate=useNavigate()

    const handleInput = (e) => {
      let name = e.target.name;
      let value = e.target.value;

      setUser({ ...user, [name]: value });
      // console.log(user);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.status == 200)
      {

        alert("Login successful");
        setUser({ email: "", password: "" });
        navigate("/post");

      }
      else if (response.status === 400)
      {
        const errorText = await response.text();
        alert(errorText);
      }
      else{
        alert("An unexpected error occurred");
      }
    } catch (error)
    {
      console.log("Error in Login", error);
      alert("An error occurred during login");
    }
  };
    return (
        
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <form onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 border-2 border-gray-300 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login Form
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="p-3 w-full border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={user.email}
              onChange={handleInput}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="p-3 w-full border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={user.password}
              onChange={handleInput}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
}