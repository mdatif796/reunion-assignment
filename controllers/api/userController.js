require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports.home = (req, res) => {
  return res.status(200).json({
    message: "running",
  });
};

// create user
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

// authenticate user
module.exports.authenticateUser = async (req, res) => {
  try {
    // if email and password is not undefined
    if (req.body.email && req.body.password) {
      // check whether it exist or not
      let user = await User.findOne({ email: req.body.email });
      // user exist and user password matches with the login credentials
      if (user && user.password === req.body.password) {
        return res.status(201).json({
          success: true,
          message: "successfully authenticated the user",
          jwt_token: {
            token: jwt.sign(user.toJSON(), process.env.JWTSECRETKEY),
          },
        });
      }
      // if not matched
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
