const User = require("../../models/user");
require("dotenv").config();

module.exports.home = (req, res) => {
  return res.status(200).json({
    message: "running",
  });
};
