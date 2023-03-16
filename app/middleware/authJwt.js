const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


// verify JWT and return the payload with user's role and username
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, data) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      } else {
        resolve(data);
        next();
      }
    });
  });
}


verifyToken_ = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.id = decoded.id;
    next();
  });
};


// check user's JWT and verify their role
authorizeEmployeeOrFinanceManager = async (authorizationHeader) => {
  if (!authorizationHeader) {
    throw new JsonWebTokenError('Token not provided');
  }

  const token = authorizationHeader.split(' ')[1];
  const payload = await verifyTokenAndReturnPayload(token);

  if (!(payload.role == 'employee' || payload.role == 'finance_manager')) {
    throw new AuthorizationError(['Employee or Finance manager role required']);
  }

  return payload;
}
isAdmin = (req, res, next) => {
  for (let i = 0; i < req.roles.length; i++) {
    if (req.roles[i].name === "admin") {
      next();
      return;
    }
  }

  res.status(403).send({
    message: "Require Admin Role!"
  });
};

isModerator = (req, res, next) => {
  for (let i = 0; i < req.roles.length; i++) {
    if (req.roles[i].name === "moderator") {
      next();
      return;
    }
  }

  res.status(403).send({
    message: "Require Moderator Role!"
  });
};

isModeratorOrAdmin = (req, res, next) => {
  for (let i = 0; i < req.roles.length; i++) {
    if (req.roles[i].name === "moderator") {
      next();
      return;
    }

    if (req.roles[i].name === "admin") {
      next();
      return;
    }
  }

  res.status(403).send({
    message: "Require Moderator or Admin Role!"
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
