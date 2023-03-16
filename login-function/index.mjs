import uniqid from 'uniqid';
import AWS from 'aws-sdk';
const userDAO = new AWS.DynamoDB.DocumentClient()
const table = 'users';
const PRE_FIX = 'u'
const saltRounds = 10;

// var jwt = require("jsonwebtoken");


exports.handler =  async (event) => {
  
  try {
        const parsedBody = JSON.parse(event.body);
        const username = parsedBody.username;
        const email = parsedBody.email;
        const password = parsedBody.password;
        
        // Save User to Database
        
        const user = {
          username: username,
          email: email,
          password: require('bcrypt').hashSync(password, saltRounds),
        }

        
        // CREATE
        const registerUser = async (user) => {
            
            const params = {
                TableName: table,
                Item: {
                    id: PRE_FIX + uniqid(),
                    username: user.username,
                    email: user.email,
                    password: user.password,       
                    roles: ["user"],
                    dateCreated: new Date().getDate().toString(),
                }
            };
            
            userDAO.put(params, (err) => {
                if (err) {
                    console.error(err);
                    throw new Error("Database connection error");
                } else {
                    console.log("registered user");
                }
            });
        };
        
        registerUser(user);

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST",
            "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
        },
          body: JSON.stringify({
              "message": "User successfully registered"
          })
      };
  } catch(err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
    },
      body: JSON.stringify({
        "message": err.message
      })
    }
  }
  


};