// app.js
const controller = require("./app/controllers/user.controller");
// const { verifySignUp } = require("./app/middleware");
const auth = require("./app/signup");



const express = require('express')
const sls = require('serverless-http')
const app = express()


app.get('/', async (req, res, next) => {
  res.status(200).send('Welcome to BMC App')
})

app.get("/api/test/all", controller.allAccess);

app.get(
  "/api/test/user",
  controller.userBoard
);

app.post(
  "/api/auth/signup",
  // [
  //   // verifySignUp.checkDuplicateUsernameOrEmail,
  //   // verifySignUp.checkRolesExisted
  // ],
  auth.signup
);


module.exports.server = sls(app)

