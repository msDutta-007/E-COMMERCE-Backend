//create a mw which will check if the re body is corect
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth_config = require("../configs/auth.config");

const verifySignUpBody = async (req, res, next) => {
  try {
    //check for each type

    if (!req.body.name) {
      return res.status(400).send("name was not provided");
    }

    if (!req.body.email) {
      return res.status(400).send("email was not provided");
    }

    if (!req.body.userId) {
      return res.status(400).send("userId was not provided");
    }

    //check if same user is already present
    const user = await userModel.findOne({ userId: req.body.userId });

    if (user) {
      return res.status(400).send("user with same id already present ");
    }
    next();
  } catch (err) {
    console.log("error while validating req body", err);
    res.status(500).send("error while validating req body");
  }
};

const verifySignInBody = async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(400).send("userId was not provided");
  }
  if (!req.body.password) {
    return res.status(400).send("Password was not provided");
  }
  next();
};

const verifyToken = async (req, res, next) => {
  //check if the token is present in the header
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "no token found : Unauthorized",
    });
  }
  //if the token is valid
  jwt.verify(token, auth_config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "unauthorized!!"
      });
    }
    const user = await userModel.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(403).send({
        message: "Unauthorized, this user for the token doesn't exist",
      });
    }
    //set the user info in the req body
    req.user = user
    next()
  });

};

const isAdmin = ( req, res, next)=>{
    const user = req.user
   if(user && user.userType.toUpperCase() === "ADMIN"){
    next()
   }else{
    return res.status(403).send({
        message : "Only admins allowed"
    })
   }
}

module.exports = {
  verifySignUpBody: verifySignUpBody,
  verifySignInBody: verifySignInBody,
  verifyToken: verifyToken,
  isAdmin : isAdmin
};
