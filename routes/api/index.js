const express = require("express");
const router = express.Router();

// middleware
const setAuthenticationMiddleware = require("../../config/setAuthenticationMiddleware");

const userController = require("../../controllers/api/userController");
const postController = require("../../controllers/api/postController");

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
// get authenticated user
router.get(
  "/user",
  setAuthenticationMiddleware.checkAuthentication,
  userController.getAuthenticatedUser
);

// create post by authenticated user
router.post(
  "/posts",
  setAuthenticationMiddleware.checkAuthentication,
  postController.createPost
);
// delete post
router.delete(
  "/posts/:id",
  setAuthenticationMiddleware.checkAuthentication,
  postController.deletePost
);
// get post
router.get(
  "/posts/:id",
  setAuthenticationMiddleware.checkAuthentication,
  postController.getPost
);

// like post
router.post(
  "/like/:id",
  setAuthenticationMiddleware.checkAuthentication,
  likeController.likePost
);

module.exports = router;
