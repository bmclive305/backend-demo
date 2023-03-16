'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const saltRounds = 10;
const table = 'users';
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.signup = (event, context, callback) => {
    const parsedBody = JSON.parse(event.body);
    const username = parsedBody.username;
    const email = parsedBody.email;
    const password = parsedBody.password;

  if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t sign up because of validation errors.'));
    return;
  }

  const user = {
    username,
    email,
    password,
  }

  registerUser(user)
  context.status(200).header("Access-Control-Allow-Origin", "*").send({ message: "User registered successfully!" });
  
    // .catch(err => {
    //   console.log(err);
    //   callback(null, {
    //     statusCode: 500,
    //     body: JSON.stringify({
    //       message: `Unable to submit user with email ${email}`
    //     })
    //   })
    // });
};

const registerUser = user => {
    console.log('Registering user');
    const timestamp = new Date().getTime();
    const userInfo = {
      TableName: table,
      Item: {
        id: "BID" + uuid.v1(),
        username: user.username,
        email: user.email,
        password: require('bcryptjs').hashSync(user.password, saltRounds),       
        roles: ["user"],
        submittedAt: timestamp,
        updatedAt: timestamp,
    },
    };
    return dynamoDb.put(userInfo).promise()
      .then(res => userInfo);
  };

