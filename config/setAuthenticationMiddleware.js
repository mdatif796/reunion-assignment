require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.checkAuthentication = async (req, res, next) => {
  try {
    // get jwt token from request headers
    const token = req.headers.authorization?.split(" ")[1];
    // if token not exist
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token needed",
      });
    }
    // extract user from jwt token
    let user = jwt.verify(token, process.env.JWTSECRETKEY);
    // set the user to request
    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
