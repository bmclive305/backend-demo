const dao = require("../dao/user.dao");
const config = require("../config/auth.config");
const saltRounds = 10;

var jwt = require("jsonwebtoken");


exports.signup = (req, res) => {
  // Save User to Database
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: require('bcrypt').hashSync(req.body.password, saltRounds),
    roles: req.body.roles,
  }
  dao.registerUser(user).then(
    res.send({ message: "User registered successfully!" })
  )
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  dao.retrieveUserByUsername(req.body.username)
    .then(user => {
      if (!user.Item) {
        res.status(404).send({
          message: "User not found"
        });
        return;
      }
      console.log("user found")
      console.log(req.body.password)
      console.log(user.Item.password)
      var passwordIsValid = require("bcrypt").compareSync(
        req.body.password,
        user.Item.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
