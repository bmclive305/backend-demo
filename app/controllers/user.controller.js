exports.allAccess = (req, res) => {
  res.status(200).header("Access-Control-Allow-Origin", "*").send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).header("Access-Control-Allow-Origin", "*").send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).header("Access-Control-Allow-Origin", "*").send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).header("Access-Control-Allow-Origin", "*").send("Moderator Content.");
};
