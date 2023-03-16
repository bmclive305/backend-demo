const dao = require("../dao/user.dao");
const ROLES = ["user", "admin", "moderator"];

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  dao.retrieveUserByUsername(req.body.username).then(user => {
    if (user.Item) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    } 

    // Email
    dao.retrieveUserByEmail(req.body.email).then(user => {
      if (user.Items.length > 0) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      } 

      next();
    });
  });
};


checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
