const jwt = require("jsonwebtoken");
const User =require("../models/User");
const userAuth = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decodedObj =jwt.verify(token, process.env.SECRET_KEY);
    
    const { id } = decodedObj;
    
    const user = await User.findById(id);
    
    req.user = user;
    if (!user) {
        throw new Error("User not found");
    }
    
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};


module.exports = {
  userAuth,
};
