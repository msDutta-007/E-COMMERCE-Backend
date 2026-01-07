const express = require("express");
const mongoose = require("mongoose");
const app = express();
const serverConfig = require("./configs/serverConfig");
const dbConfig = require("./configs/dbConfig");
const userModel = require("./models/userModel");
const bcrypt = require("bcryptjs");

app.use(express.json())

//create an admin user if not present
//connect with mongoDB
mongoose.connect(dbConfig.DB_URL);

const db = mongoose.connection;

db.on("error", () => {
  console.log("error while connecting to mongoDB");
});

db.once("open", () => {
  console.log("connected to mongoDB");
  init();
});

async function init() {
  let user = await userModel.findOne({ userId: "admin" });
  try {
    if (user) {
      console.log("admin is already present");
      return;
    }
  } catch (err) {
    console.log("error while reading the data", err);
  }

  try {
    user = await userModel.create({
      name: "Mad",
      userId: "admin",
      password: bcrypt.hashSync("mad006", 8),
      email: "msdutta006@gmail.com",
      userType: "ADMIN",
    });
    console.log("admin is created", user);
  } catch (err) {
    console.log("error while creating admin", err);
  }
}
//stitch the route to server
require("./router/authRoute")(app)
require("./router/category.routes")(app)

//start server
app.listen(serverConfig.PORT, () => {
  console.log("server has started", serverConfig.PORT);
});
