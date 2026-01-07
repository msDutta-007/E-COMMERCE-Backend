//logic to register a user

const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
const secret = require("../configs/auth.config")

exports.signup = async (req, res) => {
  //logic to create user
  //1. read thw request body
  const requestBody = req.body;

  //2.insert the data in users collection in mongoDB
  const userObj = {
    name: requestBody.name,
    userId: requestBody.userId,
    email: requestBody.email,
    userType: requestBody.userType,
    password: bcrypt.hashSync(requestBody.password, 8),
  };
  try {
    const userCreated = await userModel.create(userObj);

    const resObj = {
      name: userCreated.name,
      userId: userCreated.userId,
      email: userCreated.email,
      userType: userCreated.userType,
      createdAt: userCreated.createdAt,
      updatedAt: userCreated.updatedAt,
    };
    res.status(201).send(resObj);
  } catch (err) {
    console.log("error while registering the user", err);
    res.status(500).send("Alert: some error happened while registering user");
  }

  //return the response back to user
};

exports.signin = async (req, res) => {
  //check if the user id is present
  const user = await userModel.findOne({ userId: req.body.userId });

  if (user == null) {
    return res.status(400).send({
      messsage: "user id is not valid",
    });
  }

  //correct password?
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({
      messsage: "wrong password",
    });
  }

  //using jwt we will create the access token with a given TTL and return
  const token = jwt.sign({id : user.userId}, secret.secret,{
    expiresIn : 120
  })

  res.status(200).send({
    name : user.name,
    userId : user.userId,
    email : user.email,
    userType : user.userType,
    accessToken : token
  })
};
