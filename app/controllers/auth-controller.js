const saltRounds = 10;
const dao = require('../dao/signup-dao')

// var jwt = require("jsonwebtoken");


exports.register = (event, res) => {

  const parsedBody = JSON.parse(event.body);
  const username = parsedBody.username;
  const email = parsedBody.email;
  const password = parsedBody.password;
  
        const user = {
          username,
          email,
          password: require('bcryptjs').hashSync(password, saltRounds),
        }

        
        dao.registerUser(user);
        res.status(200).send(JSON.stringify(user));

        // return {
        //   statusCode: 200,
        //   body: JSON.stringify({
        //     message: 'Go Serverless v1.0! Your function executed successfully!',
        //     input: event
        //   })
        // };
  
};


exports.signup =  async (event) => {
  
  try {
        const parsedBody = JSON.parse(event.body);
        const username = parsedBody.username;
        const email = parsedBody.email;
        const password = parsedBody.password;
        
        // Save User to Database
        
        const user = {
          username: username,
          email: email,
          password: require('bcryptjs').hashSync(password, saltRounds),
        }

        
        await dao.registerUser(user);

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

// exports.signin = (req, res) => {
//   dao.retrieveUserByUsername(req.body.username)
//     .then(user => {
//       if (!user.Item) {
//         res.status(404).send({
//           message: "User not found"
//         });
//         return;
//       }
//       console.log("user found")
//       console.log(req.body.password)
//       console.log(user.Item.password)
//       var passwordIsValid = require("bcrypt").compareSync(
//         req.body.password,
//         user.Item.password
//       );

//       if (!passwordIsValid) {
//         return res.status(401).send({
//           accessToken: null,
//           message: "Invalid Password!"
//         });
//       }
//       var token = jwt.sign({ id: user.id }, process.env.JWT_SIGNING_SECRET, {
//         expiresIn: 86400 // 24 hours
//       });
//       res.status(200).send({
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         roles: user.roles,
//         accessToken: token
//       });
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };
