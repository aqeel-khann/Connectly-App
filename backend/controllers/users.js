const User = require("../models/users")
const express = require("express")
const app=express()
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");


const secretKey = "mySecret";


//Middleware
app.use(cookieParser())

const createUser = async (req, res) => {
  try {
    console.log(req.body);
      const { name, email, password } = req.body;
      //hash Password
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      
    const newUser = await User.create({
      name,
      email,
      password:hashPassword,
    });
    res.status(201).json({status: true,response: "User created successfully",data: newUser});
  } catch (error) {
    console.error("Error in User Creation", error);
    res.status(500).json({ status: false, response: "Error in User Creation", error });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Email  is Invalid");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Password is Invalid");
    } 
      // Token Generation function
      const generateToken = (user) => {
        const payload = {
          userId: user._id,
          email:user.email,
          name: user.name,
        };

        return jwt.sign(payload, secretKey);
      };

      const token = generateToken(user);
     res.cookie("Token", token, { httpOnly: true, secure: false });
    return res.status(200).json({data: "User login successfully" , token});
  } catch (error) {
    console.log("Invalid Data", error);
    return res.status(500).send("Login Server Error");
  }
};
module.exports = {createUser,loginUser} 


  