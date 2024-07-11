const jwt = require("jsonwebtoken")
const secretKey = "mySecret";


const Authenticate = async (req, res, next) => {
 
   try {
     const token = req.cookies.Token
 
     if (!token) res.status(400).send("We have not Token")
     const data = jwt.verify(token, secretKey)
 
     req.user = data
 
     next()
   } catch (error) {
    console.log(error);
   }
}

module.exports = {
    Authenticate
}