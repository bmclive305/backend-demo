export const handler = async(event) => {
    // TODO implement


const dao = require("../dao/user-dao");
const saltRounds = 10;


exports.signup =  async (event) => {
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
  await dao.registerUser(user)
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
}; }
