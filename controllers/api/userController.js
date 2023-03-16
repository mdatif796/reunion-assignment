const User = require("../../models/user");
require("dotenv").config();

module.exports.home = (req, res) => {
  return res.status(200).json({
    message: "running",
  });
};

module.exports.createUser = async (req, res) => {
  try {
    // first check whether user exist or not
    let user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );
    // if user exist then return user in the response
    if (user) {
      return res.status(201).json({
        success: false,
        message: "User already exist",
        user,
      });
    }
    // create user
    user = await User.create(req.body);
    return res.status(201).json({
      success: true,
      message: "User created!!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
