const express = require("express");
const router = express.Router();

// middleware
const setAuthenticationMiddleware = require("../../config/setAuthenticationMiddleware");

const userController = require("../../controllers/api/userController");
// create user
router.post("/create-user", userController.createUser);
// authenticate user
router.post("/authenticate", userController.authenticateUser);
// follow user
router.post(
  "/follow/:id",
  setAuthenticationMiddleware.checkAuthentication,
  userController.followUser
);
// unfollow user
router.post(
  "/unfollow/:id",
  setAuthenticationMiddleware.checkAuthentication,
  userController.unfollowUser
);

module.exports = router;
